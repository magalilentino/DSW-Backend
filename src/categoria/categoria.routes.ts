import { Router } from 'express'
import { sanitizeCategoriaInput, findAll, findOne, add, update, remove } from './categoria.controller.js'

export const CategoriaRouter = Router()

CategoriaRouter.get('/', findAll)
CategoriaRouter.get('/:idCategoria', findOne)
CategoriaRouter.post('/', sanitizeCategoriaInput, add)
CategoriaRouter.put('/:idCategoria', sanitizeCategoriaInput, update)
CategoriaRouter.patch('/:idCategoria', sanitizeCategoriaInput, update)
CategoriaRouter.delete('/:idCategoria', remove)