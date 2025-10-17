import { Router } from "express";
import { findAllPeluquero, findOnePeluquero, add, update, remove, sanitizePeluqueroInput } 
from "./peluquero.controller.js";

export const PeluqueroRouter = Router();

PeluqueroRouter.get("/findAllPeluquero", findAllPeluquero);
PeluqueroRouter.get('/:idPersona', findOnePeluquero)
PeluqueroRouter.post('/', sanitizePeluqueroInput, add)
PeluqueroRouter.put('/:idPersona', sanitizePeluqueroInput, update)
//PeluqueroRouter.patch('/:idPersona', sanitizePeluqueroInput, update)
PeluqueroRouter.delete('/:idPersona', remove)
