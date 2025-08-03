import { Router } from 'express'
import { sanitizeProductoInput, findAll, findOne, add, update, remove } from './producto.controller.js'

export const ProductoRouter = Router()

ProductoRouter.get('/', findAll)
ProductoRouter.get('/:idProducto', findOne)
ProductoRouter.post('/', sanitizeProductoInput, add)
ProductoRouter.put('/:idProducto', sanitizeProductoInput, update)
ProductoRouter.patch('/:idProducto', sanitizeProductoInput, update)
ProductoRouter.delete('/:idProducto', remove)