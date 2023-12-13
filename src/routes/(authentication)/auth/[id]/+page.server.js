import { error, redirect } from '@sveltejs/kit';
import { rootDB, db } from '$lib/server/db';
import { generateAuthenticationOptions } from '@simplewebauthn/server';
import { DB_NAMESPACE, DB_DATABASE } from '$env/static/private';
import { base64DecodeURL } from '$lib/utils';

export async function load({ params }) {
	const { id } = params;
	const [authReq] = await rootDB.select(`authRequest:${id}`);
	let [user] = await rootDB.select(`user:${authReq.userData.username}`);
	if (user === undefined) {
		throw error(500, { message: 'User not found' });
	}
	let authenticators = await rootDB.query(
		'SELECT * FROM type::thing("user",$user)->authenticators->authenticator',
		{
			user: user.id.split(':')[1]
		}
	);
	if (!Array.isArray(authenticators[0])) {
		throw error(500, { message: 'Error reading data' });
	}
	authenticators = authenticators[0];
	const options = await generateAuthenticationOptions({
		allowCredentials: authenticators.map((authenticator) => ({
			id: base64DecodeURL(authenticator.credentialID),
			type: 'public-key'
		})),
		userVerification: 'preferred'
	});
	await rootDB.merge(`authRequest:${id}`, {
		challenge: options.challenge
	});
    return {
		options
	};
};

const verify = async ({ request, cookies, url, params }) => {
	let { assertResponse } = Object.fromEntries(await request.formData());
	let { id } = params;
	if(!id) {
		throw error(500, { message: 'Invalid request' });
	}
	try {
		assertResponse = JSON.parse(assertResponse);
	} catch (err) {
		await rootDB.merge(`authRequest:${id}`, {
			status: 'failed'
		});
		throw error(500, { message: 'Invalid request' });
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
		rootDB.merge(`authRequest:${id}`, {
			status: 'failed'
		});
		throw error(500, { message: 'Login failed' });
	}
	const [authReq] = await rootDB.select(`authRequest:${id}`);
	if(authReq.platform){
		const [platform] = await rootDB.select(authReq.platform);
		if (platform) {
			const [[session]] = await _db.query('SELECT * FROM session WHERE platform = $platform ORDER BY createdAt DESC LIMIT 1', {
				platform: platform.id
			});
			throw redirect(302, `${platform.returnUrl}?session=${session.id.split(':')[1]}`);
		}
	}

	cookies.set('token', token, {
		path: '/',
		maxAge: 60 * 60 * 6
	});

	throw redirect(302, '/my');
};

export const actions = {
    verify
};