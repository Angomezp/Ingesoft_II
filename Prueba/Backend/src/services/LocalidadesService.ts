import { LocalidadesRepository } from "../repositories/LocalidadesRepository.ts";
import { Localidades } from "../entities/Localidades.ts";

export class LocalidadesService {
    constructor(private repo: LocalidadesRepository, private baseUrl?: string) {}

    private sanitizeBase(raw?: string) {
        return raw?.trim().replace(/^['\"]|['\"]$/g, "") ?? "";
    }

    async getLocalidades(): Promise<Localidades[] | any[]> {
        const base = this.sanitizeBase(this.baseUrl);
        if (!base) throw new Error("Missing API_BASE_URL");

        // Si hay localidades en la BD, devolverlas.
        const existing = await this.repo.findAll();
        if (existing && existing.length > 0) return existing;

        // Si no, obtenerlas del servicio upstream
        const url = base.replace(/\/+$|$/g, "") + "/apicontrollerpruebas/api/ParametrosFramework/ObtenerLocalidadesRecogidas";
        const resp = await fetch(url);
        if (!resp.ok) {
            const text = await resp.text().catch(() => "");
            throw new Error(`Upstream error ${resp.status}: ${text}`);
        }

        const data = await resp.json();
        if (!Array.isArray(data)) throw new Error("Unexpected upstream payload for localidades");

        const items = data
            .map((it: any) => ({
                NombreCompleto: String(it.NombreCompleto ?? it.nombreCompleto ?? "").trim(),
                AbreviacionCiudad: String(it.AbreviacionCiudad ?? it.abreviacionCiudad ?? it.Abreviacion ?? "").trim(),
            }))
            .filter((x: any) => x.NombreCompleto && x.AbreviacionCiudad);

        try {
            const saved = await this.repo.saveMany(items);
            return saved;
        } catch (err: any) {
            console.error("Failed to save localidades to DB:", err);
            return data; // conservar payload original si falla guardar
        }
    }
}
