import { Router } from 'express'
import { sanitizeServicioInput, findAll, findOne, add, update, remove, 
    listarServiciosPorPrecio, findAllAyD
    } from './servicio.controller.js'

export const ServicioRouter = Router()

ServicioRouter.get('/findAll', findAll)
ServicioRouter.get('/findById/:codServicio', findOne)
ServicioRouter.post('/add', sanitizeServicioInput, add)
ServicioRouter.put('/:codServicio', sanitizeServicioInput, update)
ServicioRouter.delete('/delete/:codServicio', remove);
ServicioRouter.get('/listarPorPrecio', listarServiciosPorPrecio);
ServicioRouter.get('/findAllAyD', findAllAyD);