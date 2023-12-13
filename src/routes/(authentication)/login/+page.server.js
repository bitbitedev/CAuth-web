import { rootDB } from '$lib/server/db';
import { error, redirect } from '@sveltejs/kit';
import { getPlatformByName } from '$lib/utils/server';

export const load = async ({ url }) => {
	const platform = await getPlatformByName(url.searchParams.get('ref'));
	if (platform)
		return {
			platform
		};
};

const login = async ({ request }) => {
	let body = Object.fromEntries(await request.formData());
	if (Object.prototype.hasOwnProperty.call(body, 'username')) {
		const _rootDB = await rootDB;
		let [user] = await _rootDB.select(`user:${body.username}`);
		if (user === undefined) {
			throw error(500, { message: 'User not found' });
		}
		const platform = await getPlatformByName(body.platform);
		const authReqData = {
			createdAt: new Date(),
			type: 'login',
			status: 'pending',
			userData: {
				username: body.username
			}
		};
		if (platform) authReqData.platform = platform.id;
		const [ authReq ] = await _rootDB.create('authRequest', authReqData);
		throw redirect(302, `/auth/${authReq.id.split(':')[1]}`);
	}
	throw error(500, { error: 'invalid request' });
};

const createSession = async ({ locals, request }) => {
	const { platform } = Object.fromEntries(await request.formData());
	const [ platformData ] = await locals.db.select(`platform:${platform}`);
	const [[ session ]] = await locals.db.query('fn::session_create($platform)', {
		platform: platformData.id
	});
	throw redirect(302, `${platformData.returnUrl}?session=${session.id.split(':')[1]}`);
};

export const actions = {
	login,
	createSession
};