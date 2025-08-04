import { Router } from 'express'
import { sanitizeClienteInput, findAll, findOne, add, update, remove } from './cliente.controller.js'

export const ClienteRouter = Router()

ClienteRouter.get('/', findAll)
ClienteRouter.get('/:id', findOne)
ClienteRouter.post('/', sanitizeClienteInput, add)
ClienteRouter.put('/:id', sanitizeClienteInput, update)
ClienteRouter.patch('/:id', sanitizeClienteInput, update)
ClienteRouter.delete('/:id', remove)