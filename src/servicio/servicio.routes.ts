import { Router } from 'express'
import { sanitizeServicioInput, findAll, findOne, add, update, remove, 
    listarServiciosPorPrecio, findAllAyD
    } from './servicio.controller.js'
import { verificarRol, verificarToken } from '../persona/persona.controller.js'

export const ServicioRouter = Router()

ServicioRouter.get('/findAll', findAll)
ServicioRouter.get('/findById/:codServicio', findOne)
ServicioRouter.post('/add', sanitizeServicioInput, verificarToken, verificarRol(["peluquero"]), add)
ServicioRouter.put('/:codServicio', sanitizeServicioInput, verificarToken, verificarRol(["peluquero"]), update)
ServicioRouter.delete('/delete/:codServicio', verificarToken, verificarRol(["peluquero"]), remove);
ServicioRouter.get('/listarPorPrecio', listarServiciosPorPrecio);
ServicioRouter.get('/findAllAyD', verificarToken, verificarRol(["peluquero"]), findAllAyD);