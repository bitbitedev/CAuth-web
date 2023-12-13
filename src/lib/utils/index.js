import { rootDB } from '$lib/server/db';
import { error } from '@sveltejs/kit';

export function base64EncodeURL(byteArray) {
	return btoa(
		Array.from(new Uint8Array(byteArray))
			.map((val) => {
				return String.fromCharCode(val);
			})
			.join('')
	)
		.replace(/\+/g, '-')
		.replace(/\//g, '_')
		.replace(/\=/g, '');
}

export function base64DecodeURL(b64urlstring) {
	return new Uint8Array(
		atob(b64urlstring.replace(/-/g, '+').replace(/_/g, '/'))
			.split('')
			.map((val) => {
				return val.charCodeAt(0);
			})
	);
}

export function validatePlatformName(name) {
	if (!name) {
		return false;
	}
	const regex = /^[\w-]{1,32}$/i;
	return regex.test(name);
}

export function validatePlatformDescription(name) {
	if (!name) {
		return false;
	}
	const regex = /^[\w .,]{1,256}$/i;
	return regex.test(name);
}

export function validatePlatformUrl(url) {
	if (!url) {
		return false;
	}
	const regex =
		/^https?:\/\/(?:(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}|localhost)\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/i;
	return regex.test(url);
}

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
