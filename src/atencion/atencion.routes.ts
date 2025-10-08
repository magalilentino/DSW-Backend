import { Router } from 'express';
import { findAll, findOne, add, update, remove, sanitizeAtencionInput, contarTurnos, calcularPrecioTotal, atencionesPendientes } from './atencion.controller.js';

import {verificarToken} from '../persona/persona.controller.js'
export const AtencionRouter = Router()

//La URL completa para acceder será: GET /atenciones/pendientes
AtencionRouter.get( 
    '/pendientes', 
    verificarToken,     
    atencionesPendientes 
);
AtencionRouter.get('/', findAll)
AtencionRouter.get('/: idAtencion', findOne)
AtencionRouter.post('/',sanitizeAtencionInput, add)
AtencionRouter.put('/: idAtencion', sanitizeAtencionInput, update)
AtencionRouter.delete('/: idAtencion', remove)
AtencionRouter.get('/:idAtencion/turnos', contarTurnos);
AtencionRouter.get('/:idAtencion/precio', calcularPrecioTotal);



