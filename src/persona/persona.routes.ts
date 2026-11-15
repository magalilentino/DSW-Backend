import { Router } from 'express';
import { sanitizePersonaInput } from './sanitizePersonaInput.js';
import { register, login, getPersonaById, verificarToken} from './persona.controller.js';
import { PeluqueroRouter } from "./peluquero/peluquero.routes.js";
import { ClienteRouter } from "./cliente/cliente.routes.js";

export const PersonaRouter = Router();

PersonaRouter.post('/register', sanitizePersonaInput ,register);
PersonaRouter.post('/login', sanitizePersonaInput, login);
PersonaRouter.use("/peluquero", PeluqueroRouter);
PersonaRouter.use("/cliente", ClienteRouter);
// va al final para que '/:id' no capture '/cliente' ni '/peluquero'
PersonaRouter.get('/:id', verificarToken, getPersonaById);
