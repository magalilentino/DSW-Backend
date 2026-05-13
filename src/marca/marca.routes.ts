import { Router } from 'express'
import { findAll, findOne, add, update, remove, sanitizeMarcaInput } from './marca.controller.js'
import { verificarRol, verificarToken } from '../persona/persona.controller.js'

export const MarcaRouter = Router()


MarcaRouter.get('/', findAll)
MarcaRouter.get('/:idMarca', findOne)
MarcaRouter.post('/', sanitizeMarcaInput, verificarToken ,verificarRol(["peluquero"]), add)
MarcaRouter.put('/:idMarca', sanitizeMarcaInput, verificarToken, verificarRol(["peluquero"]), update)
MarcaRouter.delete('/:idMarca',verificarToken, verificarRol(["peluquero"]), remove)