import { Router } from 'express';
import { crearAtencion, getHistoricoByCliente, getPendientesByCliente, 
    atencionesPendientes, cancelarAtencion, finalizarAtencion} from "./atencion.controller.js";
import { verificarToken } from "../persona/persona.controller.js";

export const AtencionRouter = Router()

AtencionRouter.post("/crear", verificarToken, crearAtencion);
AtencionRouter.get("/historico/:idPersona", verificarToken, getHistoricoByCliente);
AtencionRouter.get("/pendientes/:idPersona", verificarToken, getPendientesByCliente);
AtencionRouter.get("/pendientes", verificarToken, atencionesPendientes);
AtencionRouter.patch('/cancelar/:idAtencion', cancelarAtencion);
AtencionRouter.patch('/finalizar/:idAtencion', finalizarAtencion); 


