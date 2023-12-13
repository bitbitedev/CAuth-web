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
