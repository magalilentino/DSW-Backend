import { Router } from 'express';
import { crearAtencion } from "./atencion.controller.js";

export const AtencionRouter = Router();

AtencionRouter.post("/crear", crearAtencion);