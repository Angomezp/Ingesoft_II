import { Client } from 'pg';
import { env } from './../config/env.ts';


const deleteDatabase = async () => {
	const dbName = env.DB_NAME;

	const adminClient = new Client({
		user: env.DB_USERNAME,
		host: env.DB_HOST,
		password: env.DB_PASSWORD,
		port: Number(env.DB_PORT),
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