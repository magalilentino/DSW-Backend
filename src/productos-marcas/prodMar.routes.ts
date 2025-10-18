import { Router } from 'express'
import { findAll, listarProductos } from './prodMar.controller.js'

export const ProdMarRouter = Router()

ProdMarRouter.get('/', findAll)
ProdMarRouter.get('/listarProductos', listarProductos);