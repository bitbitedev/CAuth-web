import { redirect } from '@sveltejs/kit';

export async function load({ locals, url }) {
	if (!locals.loggedIn) throw redirect(307, '/login');
	if (locals.db) {
		const offset = (Math.max(1, Number(url.searchParams.get('page') ?? 1)) - 1) * 10;
		const authReqsCount = (
			await locals.db.query('SELECT count() as count FROM authRequest GROUP ALL')
		)[0].result[0];

		const authReqs = await locals.db.query(
			'SELECT * FROM authRequest ORDER BY createdAt DESC LIMIT 10 START $offset FETCH platform',
			{ offset }
		);
		return {
			authReqs: authReqs[0].result,
			pageCount: Math.ceil(authReqsCount?.count / 10),
			pageIndex: Math.max(1, Number(url.searchParams.get('page') ?? 1))
		};
	}
	return {};
}