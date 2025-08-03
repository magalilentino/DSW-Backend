import { Router } from 'express'
import { sanitizeDescuentoInput, findAll, findOne, add, update, remove } from './descuento.controller.js'

export const DescuentoRouter = Router()

DescuentoRouter.get('/', findAll)
DescuentoRouter.get('/:idDescuento', findOne)
DescuentoRouter.post('/', sanitizeDescuentoInput, add)
DescuentoRouter.put('/:idDescuento', sanitizeDescuentoInput, update)
DescuentoRouter.patch('/:idDescuento', sanitizeDescuentoInput, update)
DescuentoRouter.delete('/:idDescuento', remove)