import { error, redirect } from '@sveltejs/kit';
import nodemailer from 'nodemailer';
import { rootDB } from '$lib/server/db';
import { MAIL_HOST, MAIL_USER, MAIL_PASSWORD } from '$env/static/private';
import { RP_ID, RP_NAME, RP_ORIGIN } from '$env/static/private';
import { generateRegistrationOptions, verifyRegistrationResponse } from '@simplewebauthn/server';
import { base64EncodeURL } from '$lib/utils';

export const actions = {
	requestCode,
	getChallenge,
	verify
};

async function requestCode({ request }) {
	let body = Object.fromEntries(await request.formData());
	if (Object.prototype.hasOwnProperty.call(body, 'username')) {
		const _rootDB = await rootDB;
		let [user] = await _rootDB.select(`user:${body.username}`);
		if (user === undefined) {
			error(500, { message: 'User not found' });
		}
		let transporter = nodemailer.createTransport({
			name: 'c-auth.com',
			host: MAIL_HOST,
			port: 587,
			secure: false,
			tls: { rejectUnauthorized: false },
			auth: {
				user: MAIL_USER,
				pass: MAIL_PASSWORD
			}
		});
		let code = generateCode();
		await _rootDB.merge(user.id, {
			newDeviceCode: code
		});
		try {
			await transporter.sendMail({
				from: '"C-Auth" <moneyman@netcode.dev>',
				to: user.email,
				subject: 'Registering a new device',
				text: `Hello, you tried to register a new device at C-Auth. Here is your code: ${code}`,
				html: `Hello,<br> you tried to register a new device on C-Auth. <br>Here is your code: <b>${code}</b>`
			});
		} catch (err) {
			console.log(err);
			error(500, { message: 'Failed to send mail' });
		}
		return { email: user.email };
	}
}

async function getChallenge({ request }) {
	let body = Object.fromEntries(await request.formData());
	if (
		Object.prototype.hasOwnProperty.call(body, 'username') &&
		Object.prototype.hasOwnProperty.call(body, 'code')
	) {
		const _rootDB = await rootDB;
		let [user] = await _rootDB.select(`user:${body.username}`);
		if (user === undefined) {
			error(500, { message: 'User not found' });
		}
		if (body.code != user.newDeviceCode) error(500, { message: 'Code invalid' });
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
			type: 'new device',
			status: 'pending',
			userData: {
				username: body.username
			}
		});
		return { options, authReq: authReq[0].id.split(':')[1] };
	}
	error(500, { error: 'invalid request' });
}

async function verify({ request, cookies }) {
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
	try {
		await _rootDB.query(
			'fn::add_authenticator($name, $credentialPublicKey, $credentialID, $counter)',
			{
				name: authReq[0].userData.username,
				credentialPublicKey: base64EncodeURL(Object.values(credentialPublicKey)),
				credentialID: base64EncodeURL(Object.values(credentialID)),
				counter
			}
		);
		_rootDB.merge(`authRequest:${id}`, {
			status: 'verified'
		});
	} catch (err) {
		_rootDB.merge(`authRequest:${id}`, {
			status: 'failed'
		});
		error(500, { message: 'Signup failed' });
	}
	redirect(302, '/my');
}

function generateCode() {
	let result = '';
	let characters = '0123456789';
	for (let i = 0; i < 8; i++) {
		result += characters.charAt(Math.floor(Math.random() * characters.length));
	}
	return `${result.slice(0, 4)}-${result.slice(4)}`;
}
