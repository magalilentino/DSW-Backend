import { Router } from 'express';
import { findAll, findOne, add,   contarTurnos, calcularPrecioTotal, atencionesPendientes } from './atencion.controller.js';
import {verificarToken} from '../persona/persona.controller.js'
export const AtencionRouter = Router()

<<<<<<< HEAD
AtencionRouter.get('/pendientes', verificarToken, atencionesPendientes)
AtencionRouter.get('/', findAll);
AtencionRouter.get('/:idAtencion', findOne);
AtencionRouter.get('/:idAtencion/turnos', contarTurnos)
AtencionRouter.get('/:idAtencion/precio', calcularPrecioTotal)
AtencionRouter.post('/', verificarToken, crearAtencion);

=======
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
>>>>>>> 8c4a11389e09e395401b6ee2487d8b132e876fb8



