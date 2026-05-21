import { env } from "./../config/env.ts";
import { AuthRepository } from "../repositories/AuthRepository.ts";

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

    // Validación estricta: esperar un objeto con la forma esperada
    if (typeof data !== "object" || data === null) {
        return { ok: false, status: 500, message: "Unexpected auth response shape" };
    }

    // Requerir campo Usuario (string)
    if (!Object.prototype.hasOwnProperty.call(data, "Usuario") || typeof data.Usuario !== "string" || data.Usuario.trim() === "") {
        return { ok: false, status: 500, message: "Auth response missing required Usuario field" };
    }

    const UsuarioResp = data.Usuario;
    const IdentificacionResp = data.Identificacion ?? "";
    const NombreResp = data.Nombre ?? "";
    const TokenResp = Object.prototype.hasOwnProperty.call(data, 'TokenJWT') ? (data.TokenJWT ?? null) : null;

    // Guardar en BD vía repositorio (insert/actualiza). Si falla, devolver éxito con aviso.
    const repo = new AuthRepository();
    let savedUser = { NombreUsuario: String(UsuarioResp), Identificacion: String(IdentificacionResp), NombreCompleto: String(NombreResp) };
    try {
        const u = await repo.saveOrUpdate(savedUser as any);
        savedUser = { NombreUsuario: u.NombreUsuario, Identificacion: u.Identificacion, NombreCompleto: u.NombreCompleto };
    } catch (err: any) {
        console.error('DB save failed (AuthRepository.saveOrUpdate):', err);
        return { ok: true, status: 200, user: savedUser, token: TokenResp ?? null, message: `Warning: DB save failed: ${err?.message ?? err}` };
    }

    return { ok: true, status: 200, user: savedUser, token: TokenResp ?? null };
}
