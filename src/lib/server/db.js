import Surreal from 'surrealdb';
import { DB_HOST, DB_USER, DB_PASSWORD, DB_NAMESPACE, DB_DATABASE } from '$env/static/private';

/**
 * Creates a new database connection.
 * Reauthenticating is required
 * @returns fresh database connection
 */
const getDatabase = async () => {
	const database = new Surreal();
	await database.connect(DB_HOST);
	return database;
};

/**
 * local database connection
 * use `import { db } from '$lib/server/db';` to import the database connection
 */
export const db = getDatabase;

const getRootDatabase = async () => {
	const db = await getDatabase();
	await db.signin({
		username: DB_USER,
		password: DB_PASSWORD
	});
	await db.use({ namespace: DB_NAMESPACE, database: DB_DATABASE });
	return db;
};

export const rootDB = getRootDatabase();
