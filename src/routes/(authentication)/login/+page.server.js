import { rootDB, db } from '$lib/server/db';
import { generateAuthenticationOptions } from '@simplewebauthn/server';
import { DB_NAMESPACE, DB_DATABASE } from '$env/static/private';
import { base64DecodeURL } from '$lib/utils';
import { error, redirect } from '@sveltejs/kit';

const login = async ({ request }) => {
	let body = Object.fromEntries(await request.formData());
	if (Object.prototype.hasOwnProperty.call(body, 'username')) {
		let user = await rootDB.query('SELECT id FROM user WHERE name = $username', {
			username: body.username
		});
		if (user[0].status !== 'OK' || !Array.isArray(user[0].result)) {
			throw error(500, { message: 'Error reading data' });
		}
		user = user[0].result[0];
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
		const authReq = await rootDB.create('authRequest', {
			challenge: options.challenge,
			createdAt: new Date(),
			type: 'login',
			userData: {
				username: body.username
			}
		});
		return { options, authReq: authReq[0].id.split(':')[1] };
	}
	throw error(500, { error: 'invalid request' });
};

const verify = async ({ request, cookies }) => {
	let { assertResponse, authReq } = Object.fromEntries(await request.formData());
	assertResponse = JSON.parse(assertResponse);

	const token = await db.signin({
		NS: DB_NAMESPACE,
		DB: DB_DATABASE,
		SC: 'user',

		authReq,
		assertResponse
	});

	cookies.set('token', token);

	throw redirect(302, '/my');
};

export const actions = {
	login,
	verify
};
