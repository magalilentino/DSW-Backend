import { Router } from 'express'
import { sanitizeServicioInput, findAll, findOne, add, update, remove } from './servicio.controller.js'

export const ServicioRouter = Router()

ServicioRouter.get('/', findAll)
ServicioRouter.get('/:codigo', findOne)
ServicioRouter.post('/', sanitizeServicioInput, add)
ServicioRouter.put('/:codigo', sanitizeServicioInput, update)
ServicioRouter.patch('/:codigo', sanitizeServicioInput, update)
ServicioRouter.delete('/:codigo', remove)