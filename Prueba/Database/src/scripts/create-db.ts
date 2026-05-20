import { Client } from 'pg';
import { readFileSync } from 'fs';
import path from 'path';

import { env } from './../config/env.ts';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createDatabase = async () => {
	const dbName = env.DB_NAME;

	const adminClient = new Client({
		user: env.DB_USER,
		host: env.DB_HOST,
		password: env.DB_PASSWORD,
		port: Number(env.DB_PORT)
	});

	try {
		await adminClient.connect();

		// Verificar si la base de datos existe
		const checkResult = await adminClient.query(
			`SELECT 1 FROM pg_database WHERE datname = $1`,
			[dbName]
		);

		if (checkResult.rows.length === 0) {
			// Crear base de datos si no existe
			await adminClient.query(`CREATE DATABASE "${dbName}"`);
			console.log(`Base de datos ${dbName} creada exitosamente`);
		} else {
			console.log(`Base de datos ${dbName} ya existe`);
		}

		await adminClient.end();


		const dbClient = new Client({
			user: env.DB_USER,
			host: env.DB_HOST,
			password: env.DB_PASSWORD,
			port: Number(env.DB_PORT),
			database: dbName
		});
		await dbClient.connect();


		const sqlScriptPathUsuarios = path.join(__dirname, './../schemas/Usuarios.sql');
		const sqlScriptContent = readFileSync(sqlScriptPathUsuarios, 'utf8');

		await dbClient.query(sqlScriptContent);

		const sqlScriptPathLocalidades = path.join(__dirname, './../schemas/Localidades.sql');
		const sqlScriptContentLocalidades = readFileSync(sqlScriptPathLocalidades, 'utf8');

		await dbClient.query(sqlScriptContentLocalidades);

		const sqlScriptPathTablasApi = path.join(__dirname, './../schemas/TablasApi.sql');
		const sqlScriptContentTablasApi = readFileSync(sqlScriptPathTablasApi, 'utf8');

		await dbClient.query(sqlScriptContentTablasApi);

		console.log('Tablas creadas/existentes aplicadas correctamente');

		await dbClient.end();
	} catch (error) {
		console.error('Error al crear la base de datos o las tablas:', error);

	}
};

await createDatabase();
