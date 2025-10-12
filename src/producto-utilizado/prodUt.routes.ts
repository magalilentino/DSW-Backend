import { Router } from 'express'
import { sanitizeProdUtInput, add, registrarProdsUt } from './prodUt.controller.js'

export const ProdUtRouter = Router()

ProdUtRouter.post('/', sanitizeProdUtInput, add)
ProdUtRouter.patch('/registrarProdsUt/:idAtSer', registrarProdsUt);
