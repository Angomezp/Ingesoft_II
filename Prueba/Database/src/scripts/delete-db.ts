import { Client } from 'pg';
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const deleteDatabase = async () => {
	const dbName = process.env.DB_NAME as string;

	const adminClient = new Client({
		user: process.env.DB_USER,
		host: process.env.DB_HOST,
		password: process.env.DB_PASSWORD,
		port: Number(process.env.DB_PORT),
		database: 'postgres'
	});

	try {
		await adminClient.connect();

		await adminClient.query(
			`SELECT pg_terminate_backend(pid)
			 FROM pg_stat_activity
			 WHERE datname = $1 AND pid <> pg_backend_pid()`,
			[dbName]
		);

		await adminClient.query(`DROP DATABASE IF EXISTS "${dbName}"`);
		console.log(`Base de datos ${dbName} eliminada completamente`);
	} catch (error) {
		console.error('Error al eliminar la base de datos:', error);
	} finally {
		await adminClient.end();
	}
};

await deleteDatabase();