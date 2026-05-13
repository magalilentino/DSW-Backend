import { Router } from "express";
import { findAllPeluquero, findOnePeluquero, add, update, remove, sanitizePeluqueroInput } 
from "./peluquero.controller.js";
import { verificarRol, verificarToken } from "../persona.controller.js";

export const PeluqueroRouter = Router();

PeluqueroRouter.get("/findAllPeluquero", findAllPeluquero);
PeluqueroRouter.get('/:idPersona', findOnePeluquero)
PeluqueroRouter.post('/', sanitizePeluqueroInput, verificarToken, verificarRol(["peluquero"]), add)
PeluqueroRouter.put('/:idPersona', sanitizePeluqueroInput,verificarToken, verificarRol(["peluquero"]), update)
PeluqueroRouter.delete('/:idPersona',verificarToken, verificarRol(["peluquero"]), remove)
