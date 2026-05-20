import { Usuarios } from "../entities/Usuarios.ts";
// import { Tablas } from "../entities/Tablas";
import { Localidades } from "../entities/Localidades.ts";

import { DataSource } from "typeorm";
import { env } from "../config/env.ts";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: env.DB_HOST,
    port: env.DB_PORT,

    username: env.DB_USER,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,

    synchronize: false,
    logging: false,
    entities: [Usuarios, Localidades],

});



