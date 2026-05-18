import { Router } from 'express';
import { 
    crearAtencion, 
    getHistoricoByCliente, 
    getPendientesByCliente, 
    atencionesPendientes, 
    turnosHoy, 
    cancelarAtencion, 
    finalizarAtencion, 
    atencionesCompletadasHoy, 
    atencionesPendientesHoy, 
    gananciasHoy,
    verificarDescuentoCliente 
} from "./atencion.controller.js";
import { verificarRol, verificarToken } from "../persona/persona.controller.js";

export const AtencionRouter = Router()

AtencionRouter.post("/crear", verificarToken, verificarRol(["peluquero", "cliente"]), crearAtencion);
AtencionRouter.post("/verificar-descuento/:idPersona", verificarToken, verificarDescuentoCliente);

AtencionRouter.get("/historico/:idPersona", verificarToken, getHistoricoByCliente);
AtencionRouter.get("/pendientes/:idPersona", verificarToken, getPendientesByCliente);

AtencionRouter.get("/pendientes", verificarToken, verificarRol(["peluquero"]), atencionesPendientes);
AtencionRouter.patch('/cancelar/:idAtencion', verificarToken, verificarRol(["peluquero"]), cancelarAtencion);
AtencionRouter.patch('/finalizar/:idAtencion', verificarToken, verificarRol(["peluquero"]), finalizarAtencion); 

AtencionRouter.get("/pendientes-hoy", verificarToken, verificarRol(["peluquero"]), atencionesPendientesHoy);
AtencionRouter.get("/completadas-hoy", verificarToken, verificarRol(["peluquero"]), atencionesCompletadasHoy);
AtencionRouter.get("/ganancias-hoy", verificarToken, verificarRol(["peluquero"]), gananciasHoy);
AtencionRouter.get("/turnos-hoy", verificarToken, verificarRol(["peluquero"]), turnosHoy);