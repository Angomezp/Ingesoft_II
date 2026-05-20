import { env } from "./../config/env.ts";
import { AppDataSource } from "../database/data-source.ts";
import { Usuarios } from "../entities/Usuarios.ts";

function base64(s: string | undefined) {
    return s ? Buffer.from(s).toString("base64") : "";
}

export type AuthResult = {
    ok: boolean;
    status: number;
    message?: string;
    token?: string | null;
    user?: { NombreUsuario: string; Identificacion: string; NombreCompleto: string };
};

export async function authenticate(username: string, password: string, identificacion?: string): Promise<AuthResult> {
    const rawBase = env.API_BASE_URL;
    const base = rawBase?.trim().replace(/^['\"]|['\"]$/g, "");
    if (!base) return { ok: false, status: 500, message: "Missing API_BASE_URL" };

    const url = base.replace(/\/+$/g, "") + "/FtEntregaElectronica/MultiCanales/ApiSeguridadPruebas/api/Seguridad/AuthenticaUsuarioApp";

    const headers: Record<string, string> = {
        Usuario: username,
        Identificacion: identificacion ?? "",
        Accept: "text/json",
        IdUsuario: username,
        IdCentroServicio: "1295",
        NombreCentroServicio: "PTO/BOGOTA/CUND/COL/OF PRINCIPAL - CRA 30 # 7-45",
        IdAplicativoOrigen: "9",
        "Content-Type": "application/json",
    };

    const body = {
        Mac: "",
        NomAplicacion: "Controller APP",
        Password: base64(password),
        Path: "",
        Usuario: base64(username),
    };

    let resp: Response;
    try {
        resp = await fetch(url, { method: "POST", headers, body: JSON.stringify(body) as any });
    } catch (err: any) {
        return { ok: false, status: 500, message: `Fetch failed: ${err?.message ?? err}` };
    }

    if (resp.status !== 200) {
        const text = await resp.text().catch(() => "");
        return { ok: false, status: resp.status, message: `Remote error ${resp.status}: ${text}` };
    }

    let data: any;
    try {
        data = await resp.json();
    } catch (err) {
        return { ok: false, status: 500, message: "Invalid JSON from auth endpoint" };
    }

    // Strict validation: expect an object shaped like the example
    if (typeof data !== "object" || data === null) {
        return { ok: false, status: 500, message: "Unexpected auth response shape" };
    }

    // Require MensajeResultado === 0
    if (!Object.prototype.hasOwnProperty.call(data, "MensajeResultado") || Number(data.MensajeResultado) !== 0) {
        return { ok: false, status: 401, message: `Authentication failed (MensajeResultado=${data.MensajeResultado})` };
    }

    // Require Usuario field (string)
    if (!Object.prototype.hasOwnProperty.call(data, "Usuario") || typeof data.Usuario !== "string" || data.Usuario.trim() === "") {
        return { ok: false, status: 500, message: "Auth response missing required Usuario field" };
    }

    const UsuarioResp = data.Usuario;
    const IdentificacionResp = data.Identificacion ?? "";
    const NombreResp = data.Nombre ?? "";
    const TokenResp = Object.prototype.hasOwnProperty.call(data, 'TokenJWT') ? (data.TokenJWT ?? null) : null;

    // Save to DB (insert or update)
    // Save to DB (insert or update). If DB save fails, still return success to frontend but include a warning.
    let savedUser = { NombreUsuario: String(UsuarioResp), Identificacion: String(IdentificacionResp), NombreCompleto: String(NombreResp) };
    try {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }
        const repo = AppDataSource.getRepository(Usuarios);
        const userEntity = repo.create({ NombreUsuario: savedUser.NombreUsuario, Identificacion: savedUser.Identificacion, NombreCompleto: savedUser.NombreCompleto });
        await repo.save(userEntity);
        savedUser = { NombreUsuario: userEntity.NombreUsuario, Identificacion: userEntity.Identificacion, NombreCompleto: userEntity.NombreCompleto };
    } catch (err: any) {
        console.error('DB save failed (repo.save):', err);
        // Fallback: try raw insert with lowercase column names (common mismatch)
        try {
            const q = `INSERT INTO usuarios (nombreusuario, identificacion, nombrecompleto) VALUES ($1, $2, $3) ON CONFLICT (nombreusuario) DO UPDATE SET identificacion = EXCLUDED.identificacion, nombrecompleto = EXCLUDED.nombrecompleto`;
            await AppDataSource.manager.query(q, [savedUser.NombreUsuario, savedUser.Identificacion, savedUser.NombreCompleto]);
        } catch (err2: any) {
            console.error('DB save fallback failed (raw query):', err2);
            return { ok: true, status: 200, user: savedUser, token: TokenResp ?? null, message: `Warning: DB save failed: ${err?.message ?? err}` };
        }
        // If fallback succeeded, return success with savedUser
        return { ok: true, status: 200, user: savedUser, token: TokenResp ?? null };
    }

    return { ok: true, status: 200, user: savedUser, token: TokenResp ?? null };
}
