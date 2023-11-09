export async function load({ locals }) {
    const authenticators = await locals.db.select('authenticator');
    return {
        authenticators
    };
};

const edit = async ({ locals, request }) => {
    const { id, name} = Object.fromEntries(await request.formData());
    locals.db.merge(`authenticator:${id}`, { name });
    return {
        success: true
    };
};

export const actions = {
    edit
}