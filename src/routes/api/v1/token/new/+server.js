import { json } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { DB_NAMESPACE, DB_DATABASE } from '$env/static/private';

export async function POST({ request }) {
	let data = await request.json();
	let { platform, secret } = data;
	const token = await db().signin({
		namespace: DB_NAMESPACE,
		database: DB_DATABASE,
		scope: 'platform',

		platform,
		secret
	});
	const tokenData = parseJwt(token);
	const expires = new Date(tokenData.exp * 1000);
	return json({ token, expires });
}

function parseJwt(token) {
	return JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
}
