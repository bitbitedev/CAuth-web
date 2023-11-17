import { error } from '@sveltejs/kit';

export async function load({ locals }) {
	const [ activeSessions ] = await locals.db.query('SELECT * FROM (SELECT * FROM session) WHERE valid = true ORDER BY createdAt DESC FETCH platform');
	const [ inactiveSessions ] = await locals.db.query('SELECT * FROM (SELECT * FROM session) WHERE valid = false ORDER BY createdAt DESC FETCH platform');
	console.log(inactiveSessions);
	return { activeSessions, inactiveSessions };
}

const end = async ({ locals, request }) => {
	if(!locals.loggedIn) throw error(401, 'Unauthorized');
	const { session } = Object.fromEntries(await request.formData());
	if(!session)
		throw error(400, 'Invalid session');
	await locals.db.merge(`session:${session}`, { 
		invalidated: true
	});
}

export const actions = {
	end
}