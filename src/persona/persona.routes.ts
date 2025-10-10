import { Router } from 'express';
import { sanitizePersonaInput } from './sanitizePersonaInput.js';
import { register, login, getPersonaById, verificarToken } from './persona.controller.js';
import { PeluqueroRouter } from "./peluquero/peluquero.routes.js";

export const PersonaRouter = Router();

PersonaRouter.post('/register', sanitizePersonaInput ,register);
PersonaRouter.post('/login', sanitizePersonaInput, login);
PersonaRouter.use("/peluquero", PeluqueroRouter);
PersonaRouter.get('/:id', verificarToken, getPersonaById); //
//PersonaRouter.put("/:id", updatePersona);


