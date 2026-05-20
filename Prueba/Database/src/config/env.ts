import * as dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

function valid(key: string): string {
    const v = process.env[key];
    if (!v) throw new Error(`Missing env var: ${key}`);
    return v;
}

export const env = {
    DB_HOST: valid("DB_HOST"),
    DB_PORT: Number(valid("DB_PORT")),
    DB_USER: valid("DB_USER"),
    DB_PASSWORD: valid("DB_PASSWORD"),
    DB_NAME: valid("DB_NAME")
};  
