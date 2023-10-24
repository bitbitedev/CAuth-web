import { db } from '$lib/server/db';

export const handle = async ({ event, resolve }) => {
	let token = event.cookies.get('token');
	if (token) {
		try {
			if (!(await db.authenticate(token))) {
				event.cookies.delete('token');
			} else {
				event.locals.db = db;
				event.locals.loggedIn = true;
			}
		} catch (e) {
			event.cookies.delete('token');
		}
	}
	return await resolve(event);
};
