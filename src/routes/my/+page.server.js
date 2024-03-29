import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
	if (!locals.db) {
		redirect(302, '/login');
	}
	const recentAuths = await locals.db.query(
		'fn::firstDayOfWeek(time::now()); SELECT * FROM authRequest WHERE createdAt > fn::firstDayOfWeek(time::now()) ORDER BY createdAt DESC'
	);

	return {
		firstDayOfWeek: new Date(recentAuths[0]).toLocaleDateString(locals.lang, {
			month: 'long',
			day: 'numeric'
		}),
		recentAuths: recentAuths[1]
	};
};
