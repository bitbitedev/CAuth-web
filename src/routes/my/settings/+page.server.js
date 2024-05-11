import { redirect } from '@sveltejs/kit';

export async function load({ locals }) {
	if (!locals.loggedIn) throw redirect(307, '/login');
}
