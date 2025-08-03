import { Router } from 'express'
import { sanitizePrecioInput, findAll, findOne, add, update, remove } from './precio.controller.js'

export const PrecioRouter = Router()

PrecioRouter.get('/', findAll)
PrecioRouter.get('/:fechaImporte', findOne)
PrecioRouter.post('/', sanitizePrecioInput, add)
PrecioRouter.put('/:fechaImporte', sanitizePrecioInput, update)
PrecioRouter.patch('/:fechaImporte', sanitizePrecioInput, update)
PrecioRouter.delete('/:fechaImporte', remove)