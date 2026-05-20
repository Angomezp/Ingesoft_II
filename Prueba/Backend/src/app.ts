import cors from "cors";
import express from "express";
import { getVersion } from "./controllers/VersionController.ts";
import { login } from "./controllers/AuthController.ts";
import { getLocalidades } from "./controllers/LocalidadesController.ts";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/version", getVersion);
app.post("/login", login);
app.get("/localidades", getLocalidades);

export default app;
