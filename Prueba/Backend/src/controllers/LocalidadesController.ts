import type { Request, Response } from "express";
import { env } from "../config/env.ts";

function sanitizeBase(raw?: string) {
    return raw?.trim().replace(/^['\"]|['\"]$/g, "") ?? "";
}

export const getLocalidades = async (_req: Request, res: Response) => {
    const base = sanitizeBase(env.API_BASE_URL);
    if (!base) return res.status(500).json({ error: "Missing API_BASE_URL" });

    const url = base.replace(/\/+$/g, "") + "/apicontrollerpruebas/api/ParametrosFramework/ObtenerLocalidadesRecogidas";

    try {
        const resp = await fetch(url);
        if (!resp.ok) {
            const text = await resp.text().catch(() => "");
            return res.status(502).json({ error: `Upstream error ${resp.status}: ${text}` });
        }

        const data = await resp.json();

        // forward the payload to frontend; frontend will expect array of records
        return res.status(200).json(data);
    } catch (err: any) {
        console.error('Error fetching localidades:', err);
        return res.status(503).json({ error: `Failed to fetch localidades: ${err?.message ?? err}` });
    }
};
