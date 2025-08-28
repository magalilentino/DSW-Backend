import { Router } from 'express';
import { register, login } from './persona.controller.js';
import { sanitizePersonaInput } from './sanitizePersonaInput.js';

export const PersonaRouter = Router();

PersonaRouter.post('/register', sanitizePersonaInput ,register);
PersonaRouter.post('/login', sanitizePersonaInput, login);
