import { error, redirect } from '@sveltejs/kit';
import { validatePlatformDescription, validatePlatformUrl } from '$lib/utils/index.js';

export async function load({ params, locals }) {
	if (!locals.loggedIn) redirect(307, '/login');
	const { id } = params;
	const [platform] = await locals.db.select(`platform:${id}`);
	const [secrets] = await locals.db.query(
		'SELECT * FROM type::thing("platform",$id)->secrets->secret',
		{ id }
	);
	return {
		platform,
		secrets
	};
}

async function update({ params, request, locals }) {
	const { id } = params;
	const formData = Object.fromEntries(await request.formData());

	if (!formData.description || !validatePlatformDescription(formData.description))
		return {
			success: false,
			message: 'Platform description is invalid',
			formData
		};

	if (!formData.url || !validatePlatformUrl(formData.url))
		return {
			success: false,
			message: 'URL is not valid',
			formData
		};

	if (!formData.returnUrl || !validatePlatformUrl(formData.returnUrl))
		return {
			success: false,
			message: 'Return URL is not valid',
			formData
		};

	locals.db.merge(`platform:${id}`, {
		description: formData.description,
		url: formData.url,
		returnUrl: formData.returnUrl
	});

	return {
		success: true,
		message: 'Platform data updated successfully',
		formData
	};
}

async function createSecret({ params, request, locals }) {
	const { id } = params;
	const { name } = Object.fromEntries(await request.formData());

	const [secret] = await locals.db.query('fn::platform_secret_create($platformId, $name)', {
		platformId: `platform:${id}`,
		name
	});

	return {
		success: true,
		message: 'Platform secret updated successfully',
		secret
	};
}

async function deleteSecret({ request, locals }) {
	const { secretId } = Object.fromEntries(await request.formData());

	locals.db.delete(secretId);

	return {
		success: true,
		message: 'Platform secret deleted successfully'
	};
}

export const actions = {
	update,
	createSecret,
	deleteSecret
};
