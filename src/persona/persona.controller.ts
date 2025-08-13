import { NextFunction, Request, Response } from 'express';
import { orm } from '../shared/orm.js';
import { Persona } from './persona.entity.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const em = orm.em

// function sanitizePersonaInput(
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) {
//   req.body.sanitizedInput = {
//     dni: req.body.dni,
//     clave: req.body.clave,
//     nombre: req.body.nombre,
//     apellido: req.body.apellido,
//     telefono: req.body.telefono,
//     mail: req.body.mail,
//     type: req.body.type
//   }
  

//   Object.keys(req.body.sanitizedInput).forEach((key) => {
//     if (req.body.sanitizedInput[key] === undefined) {
//       delete req.body.sanitizedInput[key]
//     }
//   })
//   next()
// }


async function login(req: Request, res: Response) {
  try {
    const { dni, clave } = req.body;

    // Validar datos
    if (!dni || !clave) {
      return res.status(400).json({ message: 'Faltan datos' });
    }

    // Buscar persona
    const persona = await em.findOne(Persona, { dni });
    if (!persona) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    // Comparar contraseña
    const esValida = await bcrypt.compare(clave, persona.clave);
    if (!esValida) {
      return res.status(400).json({ message: 'Credenciales inválidas' });
    }

    // Generar token JWT
    const token = jwt.sign(
      { id: persona.idPersona, type: persona.type },
      'secreto-super-seguro', 
      { expiresIn: '2h' }
    );

    res.status(200).json({
      message: 'Login exitoso',
      token,
      type: persona.type
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}



export {  login }



/*async function register(req: Request, res: Response) {
  try {
    const { dni, email, clave, type } = req.body;

    // Validar datos
    if (!dni || !email || !clave || !type) {
      return res.status(400).json({ message: 'Faltan datos' });
    }
    if (!['peluquero', 'cliente'].includes(type)) {
      return res.status(400).json({ message: 'Rol inválido' });
    }

    // Verificar que no exista ya
    const existente = await em.findOne(Persona, { dni });
    if (existente) {
      return res.status(400).json({ message: 'El email ya está registrado' });
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(clave, 10);

    // Crear persona
    const persona = em.create(Persona, {
      dni,
      email,
      clave: hashedPassword,
      type
    });
    await em.flush();

    res.status(201).json({ message: 'Usuario registrado', data: { id: persona.idPersona, type: persona.type } });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}*/