import { Router } from 'express';
import { register, login } from './persona.controller.js';

export const PersonaRouter = Router();

PersonaRouter.post('/register', register);
PersonaRouter.post('/login', login);
