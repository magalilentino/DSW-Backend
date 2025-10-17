import { Router } from 'express'
import { sanitizeClienteInput, findAll, findOne, add, update, remove } from './cliente.controller.js'

export const ClienteRouter = Router()

ClienteRouter.get('/', findAll)
ClienteRouter.get('/:idPersona', findOne)
ClienteRouter.post('/', sanitizeClienteInput, add)
ClienteRouter.put('/:idPersona', sanitizeClienteInput, update)
ClienteRouter.delete('/:idPersona', remove)