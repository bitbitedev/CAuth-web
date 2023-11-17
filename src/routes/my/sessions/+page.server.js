export async function load({ locals }) {
	const [ sessions ] = await locals.db.query('SELECT * FROM (SELECT * FROM session) WHERE valid = true ORDER BY createdAt DESC FETCH platform');
	return { sessions };
}
