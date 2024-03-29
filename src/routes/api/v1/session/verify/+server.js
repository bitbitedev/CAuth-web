import { error, json } from '@sveltejs/kit';
import { db } from '$lib/server/db';

export async function POST({ request }) {
	let { session } = await request.json();
	if (!session) error(400, 'Bad request');
	const authToken = request.headers.get('authorization')?.replace('Bearer ', '');
	if (!authToken) error(401, 'Unauthorized');
	const _db = await db();
	try {
		await _db.authenticate(authToken);
	} catch (e) {
		error(401, 'Unauthorized');
	}
	const [sess] = await _db.select(`session:${session}`);
	if (!sess) error(404, 'Session not found');
	if (!sess.valid) error(403, 'Session expired');
	return json({ status: 200, session: sess });
}
