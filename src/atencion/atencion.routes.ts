import { Router } from 'express';
import { crearAtencion, getHistoricoByCliente, getPendientesByCliente } from "./atencion.controller.js";
import { verificarToken } from "../persona/persona.controller.js";

export const AtencionRouter = Router()

AtencionRouter.post("/crear", verificarToken, crearAtencion);
AtencionRouter.get("/historico/:idPersona", verificarToken, getHistoricoByCliente);
AtencionRouter.get("/pendientes/:idPersona", verificarToken, getPendientesByCliente);


