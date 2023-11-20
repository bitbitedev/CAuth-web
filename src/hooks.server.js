import { db } from '$lib/server/db';

export const handle = async ({ event, resolve }) => {
	let response;
	let token = event.cookies.get('token');
	const _db = await db();
	event.locals.lang = event.request.headers.get('accept-language')?.split(',')[0] ?? 'en';
	if (token) {
		try {
			if (!(await _db.authenticate(token))) {
				event.cookies.delete('token');
			} else {
				event.locals.db = _db;
				event.locals.loggedIn = true;
				event.locals.settings = (await _db.select('userSettings'))[0];
				event.locals.user = (await _db.query('SELECT name, email FROM $auth'))[0][0];
			}
		} catch (e) {
			event.cookies.delete('token');
		}
	}
	try {
		response = await resolve(event);
	} catch(err) {
		response = new Response("Something went wrong.", {
			status: 500,
			statusText: 'Internal Server Error'
		})
	} finally {
		_db.close();
	}
	
	return response;
};
