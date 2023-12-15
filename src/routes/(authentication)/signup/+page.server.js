import { rootDB, db } from '$lib/server/db';
import { DB_NAMESPACE, DB_DATABASE } from '$env/static/private';
import { RP_ID, RP_NAME, RP_ORIGIN } from '$env/static/private';
import { generateRegistrationOptions, verifyRegistrationResponse } from '@simplewebauthn/server';
import { base64EncodeURL } from '$lib/utils';
import { error, redirect } from '@sveltejs/kit';

const signup = async ({ request }) => {
	let body = Object.fromEntries(await request.formData());
	if (
		Object.prototype.hasOwnProperty.call(body, 'username') &&
		Object.prototype.hasOwnProperty.call(body, 'email')
	) {
		const _rootDB = await rootDB;
		let [ user ] = await _rootDB.query(
			'SELECT id FROM user WHERE id = type::thing("user",$name) OR email = $email',
			{
				name: body.username,
				email: body.email
			}
		);
		if (!Array.isArray(user)) {
			error(500, { message: 'Error reading data' });
		}
		user = user[0];
		if (user !== undefined) {
			error(500, { message: 'Username or email is already in use' });
		}
		const options = await generateRegistrationOptions({
			rpName: RP_NAME,
			rpID: RP_ID,
			userID: body.username,
			userName: body.username,
			attestationType: 'direct'
		});
		const authReq = await _rootDB.create('authRequest', {
			challenge: options.challenge,
			createdAt: new Date(),
			type: 'signup',
			status: 'pending',
			userData: {
				username: body.username,
				email: body.email
			}
		});
		return { options, authReq: authReq[0].id.split(':')[1] };
	}
	error(500, { error: 'invalid request' });
};

const verify = async ({ request, cookies }) => {
	const { attest, id } = Object.fromEntries(await request.formData());

	const _rootDB = await rootDB;
	const authReq = await _rootDB.select(`authRequest:${id}`);

	let verification;
	try {
		verification = await verifyRegistrationResponse({
			response: JSON.parse(attest),
			expectedChallenge: authReq[0].challenge,
			expectedOrigin: RP_ORIGIN,
			expectedRPID: RP_ID
		});
	} catch (err) {
		rootDB.merge(`authRequest:${id}`, {
			status: 'failed'
		});
		error(500, { message: 'Error verifying registration' });
	}
	const { verified, registrationInfo } = verification;
	const { credentialPublicKey, credentialID, counter } = registrationInfo;
	if (!verified) {
		rootDB.merge(`authRequest:${id}`, {
			status: 'failed'
		});
		error(500, { message: 'Error verifying registration' });
	}
	const _db = await db();
	try {
		const token = await _db.signup({
			namespace: DB_NAMESPACE,
			database: DB_DATABASE,
			scope: 'user',

			name: authReq[0].userData.username,
			email: authReq[0].userData.email,
			credentialPublicKey: base64EncodeURL(Object.values(credentialPublicKey)),
			credentialID: base64EncodeURL(Object.values(credentialID)),
			counter
		});
		const [[authenticator]] = await _db.query('SELECT VALUE id FROM authenticator WHERE credentialID = $credentialID', {
			credentialID: base64EncodeURL(Object.values(credentialID))
		});
		cookies.set('token', token, { path: '/' });
		rootDB.merge(`authRequest:${id}`, {
			status: 'verified',
			authenticator: authenticator
		});
	} catch (err) {
		console.log(err);
		rootDB.merge(`authRequest:${id}`, {
			status: 'failed'
		});
		error(500, { message: 'Signup failed' });
	}
	redirect(302, '/my');
};

export const actions = {
	signup,
	verify
};
