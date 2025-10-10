import { Router } from 'express'
import { sanitizeProdUtInput, add } from './prodUt.controller.js'

export const ProdUtRouter = Router()

ProdUtRouter.post('/', sanitizeProdUtInput, add)