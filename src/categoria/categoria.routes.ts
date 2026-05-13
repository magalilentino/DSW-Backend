import { Router } from 'express'
import { sanitizeCategoriaInput, findAll, findOne, add, update, remove } from './categoria.controller.js'
import { verificarRol, verificarToken } from '../persona/persona.controller.js'

export const CategoriaRouter = Router()

CategoriaRouter.get('/', findAll)
CategoriaRouter.get('/:idCategoria', findOne)
CategoriaRouter.post('/', sanitizeCategoriaInput, verificarToken, verificarRol(["peluquero"]), add)
CategoriaRouter.put('/:idCategoria', sanitizeCategoriaInput, verificarToken, verificarRol(["peluquero"]), update)
CategoriaRouter.delete('/:idCategoria',verificarToken, verificarRol(["peluquero"]), remove)