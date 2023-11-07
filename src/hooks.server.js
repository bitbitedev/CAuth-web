import { db } from '$lib/server/db';

export const handle = async ({ event, resolve }) => {
	let token = event.cookies.get('token');
	const _db = db();
	if (token) {
		try {
			if (!(await _db.authenticate(token))) {
				event.cookies.delete('token');
			} else {
				event.locals.db = _db;
				event.locals.loggedIn = true;
				event.locals.settings = (await _db.select('userSettings'))[0];
			}
		} catch (e) {
			event.cookies.delete('token');
		}
	}
	return await resolve(event);
};
