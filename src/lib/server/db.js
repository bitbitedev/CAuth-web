import Surreal from 'surrealdb.js';
import { DB_HOST, DB_USER, DB_PASSWORD, DB_NAMESPACE, DB_DATABASE } from '$env/static/private';

/**
 * Creates a new database connection.
 * Reauthenticating is required
 * @returns fresh database connection
 */
const getDatabase = () => {
	const database = new Surreal();
	database.connect(DB_HOST);
	return database;
};

/**
 * local database connection
 * use `import { db } from '$lib/server/db';` to import the database connection
 */
export const db = getDatabase;

const getRootDatabase = () => {
	const db = getDatabase();
	db.signin({
		user: DB_USER,
		pass: DB_PASSWORD
	});
	db.use({ ns: DB_NAMESPACE, db: DB_DATABASE });
	return db;
};

export const rootDB = getRootDatabase();
