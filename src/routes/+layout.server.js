export async function load({ locals }) {
	return {
		user: locals.user,
		loggedIn: locals.loggedIn,
		settings: locals.settings,
		lang: locals.lang
	};
}
