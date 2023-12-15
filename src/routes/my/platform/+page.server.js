import { error, redirect } from '@sveltejs/kit';
import {
	validatePlatformDescription,
	validatePlatformName,
	validatePlatformUrl
} from '$lib/utils/index.js';

export const load = async ({ locals }) => {
	const [ platforms ] = await locals.db.query('SELECT * FROM $auth->platforms->platform');
	return {
		platforms
	};
};

const create = async ({ request, locals }) => {
	const formData = Object.fromEntries(await request.formData());

	if (!formData.name || !validatePlatformName(formData.name))
		error(400, { message: 'Name is not valid' });

	if (!formData.description || !validatePlatformDescription(formData.description))
		error(400, { message: 'Description is not valid' });

	if (!formData.url || !validatePlatformUrl(formData.url))
		error(400, { message: 'Url is not valid' });

	if (!formData.returnUrl || !validatePlatformUrl(formData.returnUrl))
		error(400, { message: 'Return Url is not valid' });

	locals.db.query('fn::platform_create($name, $description, $url, $returnUrl)', {
		name: formData.name,
		description: formData.description,
		url: formData.url,
		returnUrl: formData.returnUrl
	});
	redirect(302, '/my/platform');
};

export const actions = {
	create
};
