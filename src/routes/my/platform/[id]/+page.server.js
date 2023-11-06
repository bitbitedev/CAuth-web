import { error, redirect } from '@sveltejs/kit';
import { validatePlatformDescription, validatePlatformName, validatePlatformUrl } from '$lib/utils/index.js';

export async function load({ params, locals }) {
    const { id } = params;
    const [ platform ] = await locals.db.select(`platform:${id}`);
    return {
        platform
    };
};

async function update({ params, request, locals }) {
    const { id } = params;
    const formData = Object.fromEntries(await request.formData());
    
    if(!formData.description || !validatePlatformDescription(formData.description))
        return {
            success: false,
            message: 'Platform description is invalid',
            formData
        }

    if(!formData.url || !validatePlatformUrl(formData.url))
        return {
            success: false,
            message: 'URL is not valid',
            formData
        }

    if(!formData.returnUrl || !validatePlatformUrl(formData.returnUrl))
        return {
            success: false,
            message: 'Return URL is not valid',
            formData
        }

    locals.db.merge(`platform:${id}`, {
        description: formData.description,
        url: formData.url,
        returnUrl: formData.returnUrl,
    });

    return {
        success: true,
        message: 'Platform data updated successfully',
        formData
    }
}

export const actions = {
    update
};