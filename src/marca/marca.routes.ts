import { Router } from 'express'
import { findAll, findOne, add, update, remove } from './marca.controller.js'

//export const MarcaRouter = Router()
export const MarcaRouter: Router = Router();

MarcaRouter.get('/', findAll)
MarcaRouter.get('/: idMarca', findOne)
MarcaRouter.post('/', add)
MarcaRouter.put('/: idMarca', update)
MarcaRouter.delete('/: idMarca', remove)