import { Router } from 'express';
import { obtenerDisponibles } from './turno.controller.js';

export const TurnoRouter = Router();

// Listar bloques libres de un peluquero en un día
TurnoRouter.get('/disponibles', obtenerDisponibles);
