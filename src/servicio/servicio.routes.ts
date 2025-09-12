import { Router } from 'express'
import { sanitizeServicioInput, findAll, findOne, add, update, remove, listarServiciosPorPrecio, detalleServiciosPorPrecio} from './servicio.controller.js'

export const ServicioRouter = Router()

ServicioRouter.get('/findAll', findAll)
ServicioRouter.get('/:codServicio', findOne)
ServicioRouter.post('/', sanitizeServicioInput, add)
ServicioRouter.put('/:codServicio', sanitizeServicioInput, update)
ServicioRouter.patch('/:codServicio', sanitizeServicioInput, update)
ServicioRouter.delete('/:codServicio', remove)
ServicioRouter.get('/listar', listarServiciosPorPrecio);
ServicioRouter.get('/detalle/:codServicio', detalleServiciosPorPrecio);   