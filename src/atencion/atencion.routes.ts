import { Router } from 'express';
import { crearAtencion, listarAtenciones } from './atencion.controller.js';

export const AtencionRouter = Router();

AtencionRouter.post('/', crearAtencion);
AtencionRouter.get('/', listarAtenciones);