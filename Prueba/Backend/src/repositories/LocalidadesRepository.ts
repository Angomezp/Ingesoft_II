import { AppDataSource } from "../database/data-source.ts";
import { Localidades } from "../entities/Localidades.ts";

export class LocalidadesRepository {
    private getRepo() {
        return AppDataSource.getRepository(Localidades);
    }

    async ensureInitialized() {
        if (!AppDataSource.isInitialized) await AppDataSource.initialize();
    }

    async findAll(): Promise<Localidades[]> {
        await this.ensureInitialized();
        return this.getRepo().find();
    }

    async saveMany(items: Partial<Localidades>[]): Promise<Localidades[]> {
        await this.ensureInitialized();
        return this.getRepo().save(items as Localidades[]);
    }
}
