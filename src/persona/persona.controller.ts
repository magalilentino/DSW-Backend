import { NextFunction, Request, Response } from 'express';
import { PersonaService } from './persona.service';
import { orm } from '../shared/orm.js';
import { Peluquero } from './peluquero.entity.js';
import { Cliente } from './cliente.entity.js';
import { Persona } from './persona.entity.js';

const em = orm.em

function sanitizePeluqueroInput(
  req: Request,
  res: Response,
  next: NextFunction
) {
  req.body.sanitizedInput = {
    dni: req.body.dni,
    clave: req.body.clave,
    nombre: req.body.nombre,
    apellido: req.body.apellido,
    telefono: req.body.telefono,
    mail: req.body.mail,
    type: req.body.type
  }
  

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key]
    }
  })
  next()
}



export class PersonaController {
  private service: PersonaService;

  constructor(service: PersonaService) {
    this.service = service;
  }



    async function add(req: Request, res: Response) {
    try {
        const persona = new Persona();
        if (req.body.type == 'peluquero') {
            const persona = em.create(Peluquero, req.body.sanitizedInput)
        }else{
            const persona = em.create(Cliente, req.body.sanitizedInput)
        }

        await em.persistAndFlush(persona)
        res.status(201).json({ message: 'persona created', data: persona })
    } catch (error: any) {
        res.status(500).json({ message: error.message })
    }
    }


  register = async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) return res.status(400).json({ message: 'Faltan datos' });

      const user = await this.service.register(username, password);
      return res.status(201).json({ message: 'Usuario creado', user });
    } catch (err: any) {
      return res.status(400).json({ message: err.message || 'Error' });
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) return res.status(400).json({ message: 'Faltan datos' });

      const auth = await this.service.authenticate(username, password);
      if (!auth) return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });

      return res.json(auth);
    } catch (err: any) {
      return res.status(500).json({ message: err.message || 'Error' });
    }
  };
}