import { Router } from 'express'
import { findAll, findOne, add, update, remove, sanitizeMarcaInput } from './marca.controller.js'

export const MarcaRouter = Router()


MarcaRouter.get('/', findAll)
MarcaRouter.get('/:idMarca', findOne)
MarcaRouter.post('/', sanitizeMarcaInput, add)
MarcaRouter.put('/:idMarca', sanitizeMarcaInput, update)
MarcaRouter.delete('/:idMarca', remove)