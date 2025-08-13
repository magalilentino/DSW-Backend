import { Router } from 'express'
import { findAll, findOne, add, update, remove, sanitizeAtencionInput, contarTurnos, calcularPrecioTotal } from './atencion.controller.js'

export const AtencionRouter = Router()


AtencionRouter.get('/', findAll)
AtencionRouter.get('/: idAtencion', findOne)
AtencionRouter.post('/',sanitizeAtencionInput, add)
AtencionRouter.put('/: idAtencion', sanitizeAtencionInput, update)
AtencionRouter.delete('/: idAtencion', remove)
AtencionRouter.get('/:idAtencion/turnos', contarTurnos);
AtencionRouter.get('/:idAtencion/precio', calcularPrecioTotal);