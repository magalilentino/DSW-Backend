import { Router } from 'express'
import { sanitizeProductoInput, findAll, findOne, add, update, remove } from './producto.controller.js'

export const CategoriaRouter = Router()

CategoriaRouter.get('/', findAll)
CategoriaRouter.get('/:idProducto', findOne)
CategoriaRouter.post('/', sanitizeProductoInput, add)
CategoriaRouter.put('/:idProducto', sanitizeProductoInput, update)
CategoriaRouter.patch('/:idProducto', sanitizeProductoInput, update)
CategoriaRouter.delete('/:idProducto', remove)