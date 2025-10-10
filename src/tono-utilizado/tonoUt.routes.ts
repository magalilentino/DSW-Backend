import { Router } from 'express'
import { sanitizeTonoUtInput, add } from './tonoUt.controller.js'

export const TonoUtRouter = Router()

TonoUtRouter.post('/', sanitizeTonoUtInput, add)