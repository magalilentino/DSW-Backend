import { Router } from 'express'
import { sanitizeTonoInput, findAll, findOne, add, update, remove, tonosDeServicio, findAllActivos } from './tono.controller.js'

export const TonoRouter = Router()

TonoRouter.get('/', findAll)
TonoRouter.get('/activos', findAllActivos)
TonoRouter.get('/:idTono', findOne)
TonoRouter.post('/', add)
TonoRouter.put('/:idTono', sanitizeTonoInput, update)
TonoRouter.patch('/:idTono', sanitizeTonoInput, update)
TonoRouter.delete('/:idTono', remove)
TonoRouter.get('/tonosPorservicio/:codServicio', tonosDeServicio);