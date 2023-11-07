import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';

export async function POST({ request }) {
	let { session } = await request.json();
	const authToken = request.headers.get('authorization').replace('Bearer ', '');
	const _db = db();
	await _db.authenticate(authToken);
	const [ authReq ] = await _db.select(`authRequest:${session}`);
	if(!authReq)
		return json({ status: 404, error: 'Session not found' });
	return json({ status: 200, session: authReq });
}
