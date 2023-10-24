import { verifyAuthenticationResponse } from '@simplewebauthn/server';
import { rootDB } from '$lib/server/db';
import { json } from '@sveltejs/kit';
import { base64DecodeURL } from '$lib/utils/index.js';
import { RP_ID, RP_NAME, RP_ORIGIN } from '$env/static/private';

export async function POST({ request }) {
	const { assertResponse, authReq } = await request.json();

	let expectedChallenge = await rootDB.query(
		"SELECT VALUE challenge FROM type::thing('authRequest',$id)",
		{
			id: authReq
		}
	);
	if (expectedChallenge[0].status !== 'OK' || !Array.isArray(expectedChallenge[0].result)) {
		return json({ status: 'error', error: 'Error reading data' });
	}
	expectedChallenge = expectedChallenge[0].result[0];

	let authenticator = await rootDB.query(
		'SELECT * FROM authenticator WHERE credentialID = $credentialID',
		{
			credentialID: assertResponse.rawId
		}
	);
	if (authenticator[0].status !== 'OK' || !Array.isArray(authenticator[0].result)) {
		return json({ status: 'error', error: 'Error reading data' });
	}
	authenticator = authenticator[0].result[0];
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
		console.error(error);
		return json({ status: 'error', error: error.message });
	}
	if (verification.verified) {
		await rootDB.merge(authenticator.id, {
			counter: verification.authenticationInfo.newCounter
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
