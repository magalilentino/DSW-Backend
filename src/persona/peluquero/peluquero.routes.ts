import { Router } from 'express'
import { sanitizePeluqueroInput, findAll, findOne, add, update, remove } from './peluquero.controller.js'

export const PeluqueroRouter = Router()

PeluqueroRouter.get('/', findAll)
PeluqueroRouter.get('/:idPersona', findOne)
PeluqueroRouter.post('/', sanitizePeluqueroInput, add)
PeluqueroRouter.put('/:idPersona', sanitizePeluqueroInput, update)
PeluqueroRouter.patch('/:idPersona', sanitizePeluqueroInput, update)
PeluqueroRouter.delete('/:idPersona', remove)