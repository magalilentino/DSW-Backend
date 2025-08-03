import { Router } from 'express'
import { sanitizeServicioInput, findAll, findOne, add, update, remove } from './servicio.controller.js'

export const ServicioRouter = Router()

ServicioRouter.get('/', findAll)
ServicioRouter.get('/:codServicio', findOne)
ServicioRouter.post('/', sanitizeServicioInput, add)
ServicioRouter.put('/:codServicio', sanitizeServicioInput, update)
ServicioRouter.patch('/:codServicio', sanitizeServicioInput, update)
ServicioRouter.delete('/:codServicio', remove)