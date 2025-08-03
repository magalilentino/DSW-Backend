import { Router } from 'express'
import { sanitizeTurnoInput, findAll, findOne, add, update, remove } from './turno.controller.js'

export const TurnoRouter = Router()

TurnoRouter.get('/', findAll)
TurnoRouter.get('/:id', findOne)
TurnoRouter.post('/', sanitizeTurnoInput, add)
TurnoRouter.put('/:id', sanitizeTurnoInput, update)
TurnoRouter.patch('/:id', sanitizeTurnoInput, update)
TurnoRouter.delete('/:id', remove)