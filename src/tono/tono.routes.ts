import { Router } from 'express'
import { sanitizeTonoInput, findAll, findOne, add, update, remove } from './tono.controller.js'

export const TonoRouter = Router()

TonoRouter.get('/', findAll)
TonoRouter.get('/:codServicio', findOne)
TonoRouter.post('/', sanitizeTonoInput, add)
TonoRouter.put('/:codServicio', sanitizeTonoInput, update)
TonoRouter.patch('/:codServicio', sanitizeTonoInput, update)
TonoRouter.delete('/:codServicio', remove)