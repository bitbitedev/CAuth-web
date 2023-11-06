import { error, redirect } from '@sveltejs/kit';
import {
	validatePlatformDescription,
	validatePlatformName,
	validatePlatformUrl
} from '$lib/utils/index.js';

export const load = async ({ locals }) => {
	const platforms = await locals.db.query('SELECT * FROM $auth->platforms->platform');
	if (platforms[0].status == 'OK')
		return {
			platforms: platforms[0].result
		};
};

const create = async ({ request, locals }) => {
	const formData = Object.fromEntries(await request.formData());

	if (!formData.name || !validatePlatformName(formData.name))
		throw error(400, { message: 'Name is not valid' });

	if (!formData.description || !validatePlatformDescription(formData.description))
		throw error(400, { message: 'Description is not valid' });

	if (!formData.url || !validatePlatformUrl(formData.url))
		throw error(400, { message: 'Url is not valid' });

	if (!formData.returnUrl || !validatePlatformUrl(formData.returnUrl))
		throw error(400, { message: 'Return Url is not valid' });

	locals.db.query('fn::platform_create($name, $description, $url, $returnUrl)', {
		name: formData.name,
		description: formData.description,
		url: formData.url,
		returnUrl: formData.returnUrl
	});
	throw redirect(302, '/my/platform');
};

export const actions = {
	create
};
