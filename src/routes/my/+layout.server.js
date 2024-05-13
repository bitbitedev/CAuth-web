export const load = async ({parent, locals}) => {
    await parent();
    if(!locals.loggedIn) {
        return {status: 302, headers: {location: '/login'}}
    }
}