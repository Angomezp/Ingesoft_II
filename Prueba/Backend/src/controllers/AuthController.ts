import type { Request, Response } from "express";
import { authenticate } from "./../services/AuthService.ts";

export const login = async (req: Request, res: Response) => {
	const { username, password, identificacion } = req.body ?? {};
	if (!username || !password) {
		return res.status(400).json({ ok: false, message: "`username` and `password` are required" });
	}

	const result = await authenticate(username, password, identificacion);

	if (!result.ok) {
		// notify front-end that login failed
		return res.status(result.status).json({ ok: false, message: result.message ?? "Login failed" });
	}

	// Include token when present
	return res.status(200).json({ ok: true, user: result.user, token: result.token ?? null });
};
