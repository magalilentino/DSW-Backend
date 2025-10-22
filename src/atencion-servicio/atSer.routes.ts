import { Router } from 'express'
import { ServiciosPorAtencion, findOne} from './atSer.controller.js';

export const AtSerRouter = Router()

AtSerRouter.get("/:idAtencion/serviciosPorAtencion", ServiciosPorAtencion)
AtSerRouter.get('/:idAtSer', findOne)