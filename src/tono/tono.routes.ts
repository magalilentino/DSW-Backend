import { Router } from 'express'
import { sanitizeTonoInput, findAll, findOne, add, update, remove, tonosDeServicio, findAllActivos } from './tono.controller.js'
import { verificarRol, verificarToken } from '../persona/persona.controller.js'

export const TonoRouter = Router()

TonoRouter.get('/', findAll)
TonoRouter.get('/activos', findAllActivos)
TonoRouter.get('/:idTono', findOne)
TonoRouter.post('/', verificarToken, verificarRol(["peluquero"]), add)
TonoRouter.put('/:idTono', sanitizeTonoInput, verificarToken, verificarRol(["peluquero"]), update)
TonoRouter.delete('/:idTono', verificarToken, verificarRol(["peluquero"]),  remove)
TonoRouter.get('/tonosPorservicio/:codServicio', tonosDeServicio);