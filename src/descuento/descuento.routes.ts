import { Router } from 'express'
import { sanitizeDescuentoInput, findAll, findOne, add, update, remove } from './descuento.controller.js'
import { verificarRol, verificarToken } from '../persona/persona.controller.js'

export const DescuentoRouter = Router()

DescuentoRouter.get('/', findAll)
DescuentoRouter.get('/:idDescuento', findOne)
DescuentoRouter.post('/', sanitizeDescuentoInput, verificarToken, verificarRol(["peluquero"]), add)
DescuentoRouter.put('/:idDescuento', sanitizeDescuentoInput, verificarToken, verificarRol(["peluquero"]), update)
DescuentoRouter.delete('/:idDescuento', verificarToken, verificarRol(["peluquero"]), remove)