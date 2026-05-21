import { AppDataSource } from "../database/data-source.ts";
import { Usuarios } from "../entities/Usuarios.ts";

export class AuthRepository {
    private getRepo() {
        return AppDataSource.getRepository(Usuarios);
    }

    async ensureInitialized() {
        if (!AppDataSource.isInitialized) await AppDataSource.initialize();
    }

    async findByNombreUsuario(nombreUsuario: string): Promise<Usuarios | null> {
        await this.ensureInitialized();
        return this.getRepo().findOneBy({ NombreUsuario: nombreUsuario } as any);
    }

    async saveOrUpdate(user: Partial<Usuarios>): Promise<Usuarios> {
        await this.ensureInitialized();
        const repo = this.getRepo();
        const entity = repo.create(user as Usuarios);
        try {
            return await repo.save(entity);
        } catch (err) {
            // Reintento con upsert raw si save falla por nombres de columnas
            try {
                const q = `INSERT INTO usuarios (nombreusuario, identificacion, nombrecompleto) VALUES ($1, $2, $3) ON CONFLICT (nombreusuario) DO UPDATE SET identificacion = EXCLUDED.identificacion, nombrecompleto = EXCLUDED.nombrecompleto RETURNING nombreusuario, identificacion, nombrecompleto`;
                const res = await AppDataSource.manager.query(q, [user.NombreUsuario, user.Identificacion, user.NombreCompleto]);
                const row = res && res[0] ? res[0] : null;
                if (row) {
                    const u = new Usuarios();
                    u.NombreUsuario = row.nombreusuario;
                    u.Identificacion = row.identificacion;
                    u.NombreCompleto = row.nombrecompleto;
                    return u;
                }
            } catch (err2) {
                throw err2;
            }
            throw err;
        }
    }
}
