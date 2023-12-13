import { redirect } from '@sveltejs/kit';
import { rootDB } from '$lib/server/db';

export async function load({ cookies, url }) {
	const sessionId = url.searchParams.get('session');
	if(!sessionId){
		cookies.delete('token', { path: '/' });
		throw redirect(302, '/');
	} else {
		const [[session]] = await rootDB.query(`SELECT * FROM session:${sessionId} FETCH platform`);
		if(session){
			rootDB.merge(session.id, { invalidated: true });
			throw redirect(303, session.platform.url);
		}
	}
}
