import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
	if (!locals.db) {
		throw redirect(302, '/login');
	}
};
