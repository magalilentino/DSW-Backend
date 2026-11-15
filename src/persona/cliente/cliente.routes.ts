import { Router } from 'express'
import { sanitizeClienteInput, findAll, findOne, add, update, remove } from './cliente.controller.js'
import { verificarRol, verificarToken } from '../persona.controller.js'

export const ClienteRouter = Router()

ClienteRouter.get('/', verificarToken, verificarRol(["peluquero"]), findAll)
ClienteRouter.get('/:idPersona', verificarToken, verificarRol(["peluquero"]), findOne)
ClienteRouter.post('/', sanitizeClienteInput, verificarToken, verificarRol(["peluquero"]), add)
ClienteRouter.put('/:idPersona', sanitizeClienteInput, verificarToken, verificarRol(["peluquero"]), update)
ClienteRouter.delete('/:idPersona', verificarToken, verificarRol(["peluquero"]), remove)
