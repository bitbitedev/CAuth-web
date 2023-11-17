export async function load({ locals }) {
	return {
		loggedIn: locals.loggedIn,
		settings: locals.settings,
		lang: locals.lang
	};
}
