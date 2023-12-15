import { error, json } from '@sveltejs/kit';
import { db } from '$lib/server/db';

export async function POST({ request }) {
	let { session } = await request.json();
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
	const [[user]] = await _db.query('SELECT * FROM type::thing("session",$sess)<-sessions<-user', {
		sess: session
	});
	return json({ status: 200, user });
}
