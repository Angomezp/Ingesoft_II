import type { Request, Response } from "express";
import { getVersionStatus } from "./../services/VersionService.ts";

// GET /version — devuelve estado de versión
export const getVersion = async (_req: Request, res: Response) => {
    try {
        const versionStatus = await getVersionStatus();

        res.status(200).json(versionStatus);
    } catch (error) {
        console.error("Error fetching version:", error);
        res.status(503).json({ error: "No se pudo consultar la versión" });
    }
}