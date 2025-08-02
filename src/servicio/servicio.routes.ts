import { Router } from 'express'
import { sanitizeServicioInput, findAll, findOne, add, update, remove } from './servicio.controller.js'

export const ServicioRouter = Router()

ServicioRouter.get('/', findAll)
ServicioRouter.get('/:id', findOne)
ServicioRouter.post('/', sanitizeServicioInput, add)
ServicioRouter.put('/:id', sanitizeServicioInput, update)
ServicioRouter.patch('/:id', sanitizeServicioInput, update)
ServicioRouter.delete('/:id', remove)