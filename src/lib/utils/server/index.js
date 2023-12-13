import { error } from '@sveltejs/kit';
import { rootDB } from '$lib/server/db';

export async function getPlatformByName(name) {
	if (name !== null && name !== undefined && name.length === 0)
		throw error(400, { message: 'Invalid request. Specify referrer or remove the ref parameter' });
	else if (name) {
		const [[ platform ]] = await rootDB.query('SELECT * FROM platform WHERE name = $name', {
			name: name
		});
		if (!platform) {
			throw error(500, { message: 'Platform not found' });
		}

		return platform;
	} else return undefined;
};