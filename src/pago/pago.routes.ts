import { Router } from 'express'
import { sanitizePagoInput, findAll, findOne, add, update, remove } from './pago.controller.js'

export const PagoRouter = Router()

PagoRouter.get('/', findAll)
PagoRouter.get('/:nroPago', findOne)
PagoRouter.post('/', sanitizePagoInput, add)
PagoRouter.put('/:nroPago', sanitizePagoInput, update)
PagoRouter.patch('/:nroPago', sanitizePagoInput, update)
PagoRouter.delete('/:nroPago', remove)