import { Router } from 'express'
import { sanitizeTurnoInput, findAll, findOne, add, update, remove } from './turno.controller.js'

export const TurnoRouter = Router()

TurnoRouter.get('/', findAll)
TurnoRouter.get('/:idTurno', findOne)
TurnoRouter.post('/', sanitizeTurnoInput, add)
TurnoRouter.put('/:idTurno', sanitizeTurnoInput, update)
TurnoRouter.patch('/:idTurno', sanitizeTurnoInput, update)
TurnoRouter.delete('/:idTurno', remove)