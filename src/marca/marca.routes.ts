import { Router } from 'express'
import { findAll, findOne, add, update, remove } from './marca.controller.js'

export const MarcaRouter = Router()


MarcaRouter.get('/', findAll)
MarcaRouter.get('/: id', findOne)
MarcaRouter.post('/', add)
MarcaRouter.put('/: id', update)
MarcaRouter.delete('/: id', remove)