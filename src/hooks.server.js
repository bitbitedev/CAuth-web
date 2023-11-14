import { db } from '$lib/server/db';

export const handle = async ({ event, resolve }) => {
	let response;
	try {
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
