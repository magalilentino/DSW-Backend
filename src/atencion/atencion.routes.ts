import { Router } from 'express';
import { crearAtencion, getHistoricoByCliente, getPendientesByCliente, atencionesPendientes, turnosHoy, 
    cancelarAtencion, finalizarAtencion, atencionesCompletadasHoy, atencionesPendientesHoy, gananciasHoy} from "./atencion.controller.js";
import { verificarToken } from "../persona/persona.controller.js";

export const AtencionRouter = Router()

AtencionRouter.post("/crear", verificarToken, crearAtencion);
AtencionRouter.get("/historico/:idPersona", verificarToken, getHistoricoByCliente);
AtencionRouter.get("/pendientes/:idPersona", verificarToken, getPendientesByCliente);
AtencionRouter.get("/pendientes", verificarToken, atencionesPendientes);
AtencionRouter.patch('/cancelar/:idAtencion', cancelarAtencion);
AtencionRouter.patch('/finalizar/:idAtencion', finalizarAtencion); 
AtencionRouter.get("/pendientes-hoy", verificarToken, atencionesPendientesHoy);
AtencionRouter.get("/completadas-hoy", verificarToken, atencionesCompletadasHoy);
AtencionRouter.get("/ganancias-hoy", verificarToken, gananciasHoy);
AtencionRouter.get("/turnos-hoy", verificarToken, turnosHoy); 