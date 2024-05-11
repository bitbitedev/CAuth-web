import { error, redirect } from '@sveltejs/kit';
import { rootDB, db } from '$lib/server/db';
import { generateAuthenticationOptions } from '@simplewebauthn/server';
import { DB_NAMESPACE, DB_DATABASE } from '$env/static/private';
import { base64DecodeURL } from '$lib/utils';

export async function load({ params, url }) {
	const { id } = params;
	const _rootDB = await rootDB;
	const [authReq] = await _rootDB.select(`authRequest:${id}`);
	const external = url.searchParams.get('external') != null;
	if (external && authReq) {
		await _rootDB.merge(`authRequest:${id}`, {
			external: true
		});
	}
	let [user] = await _rootDB.select(`user:${authReq.userData.username}`);
	if (user === undefined) {
		error(500, { message: 'User not found' });
	}
	let authenticators = await _rootDB.query(
		'SELECT * FROM type::thing("user",$user)->authenticators->authenticator',
		{
			user: user.id.split(':')[1]
		}
	);
	if (!Array.isArray(authenticators[0])) {
		error(500, { message: 'Error reading data' });
	}
	authenticators = authenticators[0];
	const options = await generateAuthenticationOptions({
		allowCredentials: authenticators.map((authenticator) => ({
			id: base64DecodeURL(authenticator.credentialID),
			type: 'public-key'
		})),
		userVerification: 'preferred'
	});
	await _rootDB.merge(`authRequest:${id}`, {
		challenge: options.challenge
	});
	return {
		options,
		external,
		code: id.slice(-6),
		id
	};
}

const verify = async ({ request, cookies, params }) => {
	let { assertResponse } = Object.fromEntries(await request.formData());
	let { id } = params;
	const _rootDB = await rootDB;
	if (!id) {
		error(500, { message: 'Invalid request' });
	}
	try {
		assertResponse = JSON.parse(assertResponse);
	} catch (err) {
		await _rootDB.merge(`authRequest:${id}`, {
			status: 'failed'
		});
		error(500, { message: 'Invalid request' });
	}

	const _db = await db();
	let token;
	try {
		token = await _db.signin({
			namespace: DB_NAMESPACE,
			database: DB_DATABASE,
			scope: 'user',

			authReq: id,
			assertResponse
		});
	} catch (err) {
		_rootDB.merge(`authRequest:${id}`, {
			status: 'failed'
		});
		error(500, { message: 'Login failed' });
	}
	const [authReq] = await _rootDB.select(`authRequest:${id}`);
	if (!authReq.external && authReq.platform) {
		const [platform] = await _rootDB.select(authReq.platform);
		if (platform) {
			const [[session]] = await _db.query(
				'SELECT * FROM session WHERE platform = $platform ORDER BY createdAt DESC LIMIT 1',
				{
					platform: platform.id
				}
			);
			redirect(302, `${platform.returnUrl}?session=${session.id.split(':')[1]}`);
		}
	} else if (authReq.external) {
		_rootDB.merge(`authRequest:${id}`, {
			userData: {
				...authReq.userData,
				token
			}
		});
		redirect(302, '/my');
	}

	cookies.set('token', token, {
		path: '/',
		maxAge: 60 * 60 * 6
	});

	redirect(302, '/my');
};

export const actions = {
	verify
};
