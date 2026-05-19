import { Client } from 'pg';
import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const resetDatabase = async () => {
	const dbName = process.env.DB_NAME as string;

	try {
		const adminClient = new Client({
			user: process.env.DB_USER,
			host: process.env.DB_HOST,
			password: process.env.DB_PASSWORD,
			port: Number(process.env.DB_PORT),
			database: 'postgres'
		});

		await adminClient.connect();

		const checkResult = await adminClient.query(
			`SELECT 1 FROM pg_database WHERE datname = $1`,
			[dbName]
		);

		await adminClient.end();

		if (checkResult.rows.length === 0) {
			console.log(`La base de datos ${dbName} no existe. Por favor, crea la base de datos antes de intentar resetearla.`);
			return;
		}

		const dbClient = new Client({
			user: process.env.DB_USER,
			host: process.env.DB_HOST,
			password: process.env.DB_PASSWORD,
			port: Number(process.env.DB_PORT),
			database: dbName
		});

		await dbClient.connect();
		await dbClient.query('TRUNCATE TABLE usuarios, localidades RESTART IDENTITY CASCADE');
		await dbClient.end();

		console.log(`Base de datos ${dbName} reiniciada en modo soft reset`);
	} catch (error) {
		console.error('Error al resetear la base de datos:', error);
	}
};

void resetDatabase();