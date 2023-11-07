import { error, json } from '@sveltejs/kit';
import { db } from '$lib/server/db';

export async function POST({ request }) {
	let { session } = await request.json();
	const authToken = request.headers.get('authorization').replace('Bearer ', '');
	const _db = db();
	try {
		await _db.authenticate(authToken);
	} catch (e) {
		throw error(401, 'Unauthorized');
	};
	const [authReq] = await _db.select(`authRequest:${session}`);
	if (!authReq)
		throw error(404, 'Session not found');
	return json({ status: 200, session: authReq });
}
