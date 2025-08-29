import { Router } from 'express';
import { register, login } from './persona.controller.js';
import { sanitizePersonaInput } from './sanitizePersonaInput.js';
import { PeluqueroRouter } from "./peluquero/peluquero.routes.js";

export const PersonaRouter = Router();

PersonaRouter.post('/register', sanitizePersonaInput ,register);
PersonaRouter.post('/login', sanitizePersonaInput, login);
PersonaRouter.use("/peluquero", PeluqueroRouter);


