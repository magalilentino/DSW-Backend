import { Router } from 'express';
import { obtenerBloquesDisponibles, obtenerBloquesDia } from './bloque.controller.js';

export const BloqueRouter = Router();

BloqueRouter.get("/disponibles", obtenerBloquesDisponibles);
BloqueRouter.get("/byFecha", obtenerBloquesDia);