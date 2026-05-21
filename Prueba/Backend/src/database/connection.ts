import { DataSource } from "typeorm";
import { AppDataSource } from "./data-source.ts";

// Conectar a la BD usando AppDataSource (patrón singleton)

class DatabaseConnection {
    private static instance: DataSource | null = null;

    private constructor() { }
    
    public static getInstance(): DataSource {
        if (!DatabaseConnection.instance) {
            DatabaseConnection.instance = AppDataSource;
        }
        return DatabaseConnection.instance;
    }

	static async initialize(): Promise<DataSource> {
		const ds = DatabaseConnection.getInstance();
		if (!ds.isInitialized) {
			await ds.initialize();
		}
		return ds;
	}
	static async close(): Promise<void> {
		const ds = DatabaseConnection.getInstance();

		if (ds && ds.isInitialized) {
			await ds.destroy();
			DatabaseConnection.instance = null;
		}
	}
}
export default DatabaseConnection;