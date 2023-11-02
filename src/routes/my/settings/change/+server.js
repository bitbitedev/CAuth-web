import { json } from '@sveltejs/kit';

export const POST = async ({ locals, request }) => {
    const formData = Object.fromEntries(await request.formData());
    formData.developermode = formData.developermode === 'true';
    if(!locals.settings){
        const [ us ] = await locals.db.create('userSettings', formData);
        locals.db.query('RELATE $auth->settings->$us', { us: us.id });
    } else {
        locals.db.merge('userSettings', formData);
    }
    return json({ success: true });
}