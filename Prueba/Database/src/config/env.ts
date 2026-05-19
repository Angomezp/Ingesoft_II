import * as dotenv from "dotenv";
import path from "node:path";

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

function valid(key: string): string {
    const v = process.env[key];
    if (!v) throw new Error(`Missing env var: ${key}`);
    return v;
}

export const env = {
    DB_HOST: valid("DB_HOST"),
    DB_PORT: Number(valid("DB_PORT")),
    DB_USERNAME: valid("DB_USERNAME"),
    DB_PASSWORD: valid("DB_PASSWORD"),
    DB_NAME: valid("DB_NAME")
};  
