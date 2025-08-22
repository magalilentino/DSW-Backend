import { Router } from 'express'
import { login} from './persona.controller.js'

export const PersonaRouter = Router()


PersonaRouter.post('/login', login)

