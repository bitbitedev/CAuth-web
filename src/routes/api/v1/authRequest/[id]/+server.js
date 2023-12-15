import { json, error } from '@sveltejs/kit';
import { rootDB } from '$lib/server/db';

export const GET = async ({ params, getClientAddress, cookies }) => {
	const _rootDB = await rootDB;
	const [authReq] = await _rootDB.select(`authRequest:${params.id}`);
	if (authReq.userData.ip !== getClientAddress()) {
		error(401, { message: 'Unauthorized' });
	}
	if (authReq.platform) {
		const [platform] = await _rootDB.select(authReq.platform);
		if (platform) {
			const [[session]] = await _rootDB.query(
				'SELECT * FROM session WHERE platform = $platform ORDER BY createdAt DESC LIMIT 1',
				{
					platform: platform.id
				}
			);
			authReq.redirectUrl = `${platform.returnUrl}?session=${session.id.split(':')[1]}`;
		}
	} else {
		authReq.redirectUrl = '/my';
	}
	if (authReq.external && authReq.userData.token) {
		cookies.set('token', authReq.userData.token, {
			path: '/',
			maxAge: 60 * 60 * 6
		});
		_rootDB.merge(`authRequest:${params.id}`, {
			userData: {
				token: null
			}
		});
	}
	return json(authReq);
};
