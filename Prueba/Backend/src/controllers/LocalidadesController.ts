import type { Request, Response } from "express";
import { env } from "../config/env.ts";
import { AppDataSource } from "../database/data-source.ts";
import { Localidades } from "../entities/Localidades.ts";

function sanitizeBase(raw?: string) {
    return raw?.trim().replace(/^['\"]|['\"]$/g, "") ?? "";
}

// Behavior:
// - If there are localidades in DB, return them (avoid upstream call).
// - If DB is empty, fetch upstream, persist results, and return saved records.
export const getLocalidades = async (_req: Request, res: Response) => {
    const base = sanitizeBase(env.API_BASE_URL);
    if (!base) return res.status(500).json({ error: "Missing API_BASE_URL" });

    try {
        if (!AppDataSource.isInitialized) await AppDataSource.initialize();
        const repo = AppDataSource.getRepository(Localidades);

        const existing = await repo.find();
        if (existing && existing.length > 0) {
            return res.status(200).json(existing);
        }

        const url = base.replace(/\/+$/g, "") + "/apicontrollerpruebas/api/ParametrosFramework/ObtenerLocalidadesRecogidas";
        const resp = await fetch(url);
        if (!resp.ok) {
            const text = await resp.text().catch(() => "");
            return res.status(502).json({ error: `Upstream error ${resp.status}: ${text}` });
        }

        const data = await resp.json();
        if (!Array.isArray(data)) {
            return res.status(500).json({ error: "Unexpected upstream payload for localidades" });
        }

        // Map and persist. Use repo.save for bulk insert; catch and log DB errors.
        const items = data.map((it: any) => {
            return repo.create({
                NombreCompleto: String(it.NombreCompleto ?? it.nombreCompleto ?? "").trim(),
                AbreviacionCiudad: String(it.AbreviacionCiudad ?? it.abreviacionCiudad ?? it.Abreviacion ?? "").trim(),
            });
        }).filter((x: any) => x.NombreCompleto && x.AbreviacionCiudad);

        let saved: Localidades[] = [];
        try {
            saved = await repo.save(items);
        } catch (err: any) {
            console.error('Failed to save localidades to DB:', err);
            // Even if DB save fails, still return upstream payload to frontend.
            return res.status(200).json(data);
        }

        return res.status(200).json(saved);
    } catch (err: any) {
        console.error('Error in getLocalidades:', err);
        return res.status(503).json({ error: `Failed to fetch/persist localidades: ${err?.message ?? err}` });
    }
};
