import { error } from '@sveltejs/kit';

export async function load({ locals }) {
	const [ sessions ] = await locals.db.query('SELECT * FROM (SELECT * FROM session WHERE createdAt > (time::now() - 1w)) ORDER BY valid DESC, createdAt DESC FETCH platform');
	return { sessions };
}

const end = async ({ locals, request }) => {
	if(!locals.loggedIn) error(401, 'Unauthorized');
	const { session } = Object.fromEntries(await request.formData());
	if(!session)
		error(400, 'Invalid session');
	await locals.db.merge(`session:${session}`, { 
		invalidated: true
	});
}

export const actions = {
	end
}