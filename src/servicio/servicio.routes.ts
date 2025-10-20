import { Router } from 'express'
import { sanitizeServicioInput, findAll, findOne, add, update, remove, 
    listarServiciosPorPrecio, detalleServiciosPorPrecio, findAllAyD
    //listarProductosDeServicio, listarTonosDeServicio
    } from './servicio.controller.js'

export const ServicioRouter = Router()

ServicioRouter.get('/findAll', findAll)
ServicioRouter.get('/findById/:codServicio', findOne)
ServicioRouter.post('/add', sanitizeServicioInput, add)
ServicioRouter.put('/:codServicio', sanitizeServicioInput, update)
ServicioRouter.delete('/delete/:codServicio', remove);
ServicioRouter.get('/listarPorPrecio', listarServiciosPorPrecio);
ServicioRouter.get('/detalle/:codServicio', detalleServiciosPorPrecio);
ServicioRouter.get('/findAllAyD', findAllAyD);
//ServicioRouter.get('/ProductosDelServicio/:codServicio', listarProductosDeServicio);  
//ServicioRouter.get('/TonosDelServicio/:codServicio', listarTonosDeServicio);