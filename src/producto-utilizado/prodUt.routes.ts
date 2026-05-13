import { Router } from 'express'
import { sanitizeProdUtInput, add, registrarProdsUt } from './prodUt.controller.js'
import { verificarRol, verificarToken } from '../persona/persona.controller.js';

export const ProdUtRouter = Router()

ProdUtRouter.post('/', sanitizeProdUtInput, add)
ProdUtRouter.patch('/registrarProdsUt/:idAtSer', verificarToken, verificarRol(["peluquero"]), registrarProdsUt);
