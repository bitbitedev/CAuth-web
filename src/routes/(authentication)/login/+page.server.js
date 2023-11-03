import { rootDB, db } from '$lib/server/db';
import { generateAuthenticationOptions } from '@simplewebauthn/server';
import { DB_NAMESPACE, DB_DATABASE } from '$env/static/private';
import { base64DecodeURL } from '$lib/utils';
import { error, redirect } from '@sveltejs/kit';

export const load = async ({ url }) => {
	const platform = getPlatformByName(url.searchParams.get('ref'));
	if(platform)
		return {
			platform
		};
};

const login = async ({ request, url }) => {
	let body = Object.fromEntries(await request.formData());
	if (Object.prototype.hasOwnProperty.call(body, 'username')) {
		let [ user ] = await rootDB.select(`user:${body.username}`);
		if (user === undefined) {
			throw error(500, { message: 'User not found' });
		}
		let authenticators = await rootDB.query(
			'SELECT * FROM type::thing("user",$user)->authenticators->authenticator',
			{
				user: user.id.split(':')[1]
			}
		);
		if (authenticators[0].status !== 'OK' || !Array.isArray(authenticators[0].result)) {
			throw error(500, { message: 'Error reading data' });
		}
		authenticators = authenticators[0].result;
		const options = await generateAuthenticationOptions({
			allowCredentials: authenticators.map((authenticator) => ({
				id: base64DecodeURL(authenticator.credentialID),
				type: 'public-key'
			})),
			userVerification: 'preferred'
		});
		const platform = await getPlatformByName(url.searchParams.get('ref'));
		const authReqData = {
			challenge: options.challenge,
			createdAt: new Date(),
			type: 'login',
			status: 'pending',
			userData: {
				username: body.username
			}
		};
		if(platform)
			authReqData.platform = platform.id;
		const authReq = await rootDB.create('authRequest', authReqData);
		return { options, authReq: authReq[0].id.split(':')[1] };
	}
	throw error(500, { error: 'invalid request' });
};

const verify = async ({ request, cookies, url }) => {
	let { assertResponse, authReq } = Object.fromEntries(await request.formData());
	try {
		assertResponse = JSON.parse(assertResponse);
	} catch (err) {
		await rootDB.merge(`authRequest:${authReq}`, {
			status: 'failed'
		});
		throw error(500, { message: 'Invalid request' });
	}

	let token;
	try {
		token = await db.signin({
			NS: DB_NAMESPACE,
			DB: DB_DATABASE,
			SC: 'user',

			authReq,
			assertResponse
		});
	} catch (err) {
		await rootDB.merge(`authRequest:${authReq}`, {
			status: 'failed'
		});
		throw error(500, { message: 'Login failed' });
	}

	const platform = await getPlatformByName(url.searchParams.get('ref'));
	if(platform){
		throw redirect(302, `${platform.returnUrl}?token=${authReq}`);
	}

	cookies.set('token', token);
	
	throw redirect(302, '/my');
};

export const actions = {
	login,
	verify
};

const getPlatformByName = async (name) => {
	if(name !== null && name.length === 0)
		throw error(400, { message: 'Invalid request. Specify referrer or remove the ref parameter' });
	else if(name){
		const platform = await rootDB.query('SELECT * FROM platform WHERE name = $name', {
			name: name
		});
		if (platform[0].status !== 'OK' || !Array.isArray(platform[0].result)) {
			throw error(500, { message: 'Error reading data' });
		}
		const platformData = platform[0].result;
		if (platformData.length === 0) {
			throw error(500, { message: 'Platform not found' });
		}

		return platformData[0];
	}
	else return undefined;
};