import { json, error } from '@sveltejs/kit';

export const GET = async ({ locals }) => {
    if(!locals.user){
        error(401, { message: 'Unauthorized' });
    }
    const [pendingAuths] = await locals.db.query(`SELECT * FROM authRequest WHERE status = 'pending' AND createdAt > time::now()-5m ORDER BY createdAt DESC FETCH platform`);
    return json(pendingAuths);
};