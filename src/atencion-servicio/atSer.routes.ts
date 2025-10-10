import { Router } from 'express'
import { ServiciosPorAtencion} from './atSer.controller.js';

export const AtSerRouter = Router()

AtSerRouter.get("/:idAtencion/serviciosPorAtencion", ServiciosPorAtencion)
// AtSerRouter.get('/', findAll)