import type { Request, Response } from "express";
import { env } from "../config/env.ts";
import { LocalidadesRepository } from "../repositories/LocalidadesRepository.ts";
import { LocalidadesService } from "../services/LocalidadesService.ts";

const repo = new LocalidadesRepository();
const service = new LocalidadesService(repo, env.API_BASE_URL);

export const getLocalidades = async (_req: Request, res: Response) => {
    if (!env.API_BASE_URL) return res.status(500).json({ error: "Missing API_BASE_URL" });

    try {
        const items = await service.getLocalidades();
        return res.status(200).json(items);
    } catch (err: any) {
        console.error('Error in getLocalidades:', err);
        return res.status(503).json({ error: `Failed to fetch/persist localidades: ${err?.message ?? err}` });
    }
};
