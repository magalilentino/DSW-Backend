import { Router } from 'express'
import { sanitizePeluqueroInput, findAll, findOne, add, update, remove } from './peluquero.controller.js'

export const PeluqueroRouter = Router()

PeluqueroRouter.get('/', findAll)
PeluqueroRouter.get('/:id', findOne)
PeluqueroRouter.post('/', sanitizePeluqueroInput, add)
PeluqueroRouter.put('/:id', sanitizePeluqueroInput, update)
PeluqueroRouter.patch('/:id', sanitizePeluqueroInput, update)
PeluqueroRouter.delete('/:id', remove)