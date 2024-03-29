import { verifyAuthenticationResponse } from '@simplewebauthn/server';
import { rootDB } from '$lib/server/db';
import { json } from '@sveltejs/kit';
import { base64DecodeURL } from '$lib/utils/index.js';
import { RP_ID, RP_ORIGIN } from '$env/static/private';

export async function POST({ request }) {
	const { assertResponse, authReq } = await request.json();

	const _rootDB = await rootDB;
	let expectedChallenge = await _rootDB.query(
		"SELECT VALUE challenge FROM type::thing('authRequest',$id)",
		{
			id: authReq
		}
	);
	if (!Array.isArray(expectedChallenge[0])) {
		return json({ status: 'error', error: 'Error reading data' });
	}
	[expectedChallenge] = expectedChallenge[0];

	let authenticator = await _rootDB.query(
		'SELECT * FROM authenticator WHERE credentialID = $credentialID',
		{
			credentialID: assertResponse.rawId
		}
	);
	if (!Array.isArray(authenticator[0])) {
		return json({ status: 'error', error: 'Error reading data' });
	}
	[authenticator] = authenticator[0];
	authenticator.credentialID = base64DecodeURL(authenticator.credentialID);
	authenticator.credentialPublicKey = base64DecodeURL(authenticator.credentialPublicKey);

	let verification;
	try {
		verification = await verifyAuthenticationResponse({
			response: assertResponse,
			expectedChallenge,
			expectedOrigin: RP_ORIGIN,
			expectedRPID: RP_ID,
			authenticator
		});
	} catch (error) {
		await _rootDB.merge(`authRequest:${authReq}`, {
			status: 'failed'
		});
		return json({ status: 'error', error: error.message });
	}
	if (verification.verified) {
		await _rootDB.merge(authenticator.id, {
			counter: verification.authenticationInfo.newCounter
		});
		await _rootDB.merge(`authRequest:${authReq}`, {
			status: 'verified',
			authenticator: authenticator.id
		});
	}
	const response = {
		status: verification.verified ? 'ok' : error
	};
	if (!verification.verified) {
		response.error = 'Verification failed';
	}
	return json(response);
}
