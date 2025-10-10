import { Router } from 'express'
import { atencionesPendientes } from './atencion.controller.js'
import {verificarToken} from '../persona/persona.controller.js'

export const AtencionRouter = Router()

// AtencionRouter.post("/crear", crearAtencion)
AtencionRouter.get('/pendientes', verificarToken, atencionesPendientes)
// // AtencionRouter.get('/', findAll)
// // AtencionRouter.get('/:idAtencion', findOne)
// // AtencionRouter.get('/:idAtencion/turnos', contarTurnos)
// // AtencionRouter.get('/:idAtencion/precio', calcularPrecioTotal)
// AtencionRouter.post('/', verificarToken, crearAtencion)