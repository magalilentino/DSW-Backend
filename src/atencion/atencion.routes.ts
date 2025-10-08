import { Router } from 'express';
import { findAll, findOne, add, update, remove, sanitizeAtencionInput, contarTurnos, 
    calcularPrecioTotal, atencionesPendientes, listarServiciosDeAtencion, cancelarAtencion, confirmarAtencion } from './atencion.controller.js';

import {verificarToken} from '../persona/persona.controller.js'
export const AtencionRouter = Router()

AtencionRouter.get('/pendientes', verificarToken, atencionesPendientes);
AtencionRouter.get('/:idAtencion/serviciosDeAtencion',listarServiciosDeAtencion)
AtencionRouter.get('/', findAll)
AtencionRouter.get('/: idAtencion', findOne)
AtencionRouter.post('/',sanitizeAtencionInput, add)
AtencionRouter.put('/: idAtencion', sanitizeAtencionInput, update)
AtencionRouter.delete('/: idAtencion', remove)
AtencionRouter.get('/:idAtencion/turnos', contarTurnos);
AtencionRouter.get('/:idAtencion/precio', calcularPrecioTotal);
AtencionRouter.put('/:idAtencion/cancelar', cancelarAtencion, update);
AtencionRouter.put('/:idAtencion/confirmar', confirmarAtencion, update);


