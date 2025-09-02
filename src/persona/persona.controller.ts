import { NextFunction, Request, Response } from 'express';
import { orm } from '../shared/orm.js';
import { Persona } from './persona.entity.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const em = orm.em

export async function login(req: Request, res: Response) {
  try {
    const { email, clave } = req.body;

    if (!email || !clave) {
      return res.status(400).json({ message: 'Faltan datos' });
    }
    
    const persona = await em.findOne(Persona, { email });
    if (!persona || !(await bcrypt.compare(clave, persona.clave))) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: persona.idPersona, type: persona.type, nombre: persona.nombre },
      '1234',
      { expiresIn: '2h' }
    );

    res.status(200).json({
      message: 'Login exitoso',
      token,
      type: persona.type,
      nombre: persona.nombre
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
}

export async function register(req: Request, res: Response) {
  try {
    const { nombre, apellido, dni, email, telefono, clave, type } = req.body;

    if (!nombre || !apellido || !dni || !email || !telefono || !clave || !type) {
      return res.status(400).json({ message: 'Faltan datos' });
    }

    if (!['cliente', 'peluquero'].includes(type)) {
      return res.status(400).json({ message: 'Error en el tipo de persona' });  //lo dejo por si en algun momento el register es de los dos tipos de personas
    }

    const existente = await em.findOne(Persona, { email });
    if (existente) return res.status(400).json({ message: 'El email ya está registrado' });

    const hashedPassword = await bcrypt.hash(clave, 10);

    const persona = em.create(Persona, {
      nombre,
      apellido,
      dni,
      email,
      telefono,
      clave: hashedPassword,
      type
    });
    await em.flush();

    res.status(201).json({ message: 'Usuario registrado', data: { id: persona.idPersona, type: persona.type } });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
}