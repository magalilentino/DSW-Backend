import { NextFunction, Request, Response } from 'express';
import { orm } from '../shared/orm.js';
import { Persona } from './persona.entity.js';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from "jsonwebtoken";

const em = orm.em

const JWT_SECRET = process.env.JWT_SECRET;

export function verificarToken(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token no proporcionado" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token,  JWT_SECRET!);

    if (
      typeof decoded === "object" &&
      "id" in decoded &&
      "type" in decoded &&
      "nombre" in decoded
    ) {
      req.user = {
        id: decoded.id as number,
        type: decoded.type as string,
        nombre: decoded.nombre as string,
      };
      next();
    } else {
      return res.status(403).json({ message: "Token inválido o incompleto" });
    }
  } catch (error) {
    return res.status(403).json({ message: "Token inválido o expirado" });
  }
}

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

    // Obtener el secret de las variables de entorno
  const secret = process.env.JWT_SECRET;

  // 1. **VALIDACIÓN CRÍTICA**: Si el secret no está cargado, lanza un error interno.
  if (!secret) {
      throw new Error("La clave secreta JWT_SECRET no está configurada.");
  }

  const token = jwt.sign(
      { id: persona.idPersona, type: persona.type, nombre: persona.nombre },
      secret, // Usamos la variable local 'secret'
      { expiresIn: '2h' }
  );

    // const token = jwt.sign(
    //   { id: persona.idPersona, type: persona.type, nombre: persona.nombre },
    //   JWT_SECRET!,
    //   { expiresIn: '2h' }
    // );

    res.status(200).json({
      message: 'Login exitoso',
      token,
      idPersona: persona.idPersona,
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

export async function getPersonaById(req: Request, res: Response) {
  try {

    const id = Number(req.params.id);

    const persona = await em.findOne(Persona, { idPersona: id });
    if (!persona) return res.status(404).json({ message: "Persona no encontrada" });

    res.status(200).json(persona);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener la persona" });
  }
}

//middleware
// export function verificarToken(req: Request, res: Response, next: NextFunction) {
//   const authHeader = req.headers.authorization;

//   if (!authHeader) {
//     return res.status(401).json({ message: "Token no proporcionado" });
//   }

//   const token = authHeader.split(" ")[1];

//   try {
//     const decoded = jwt.verify(token, "1234"); // misma clave que usás en login
//     req.user = decoded; // ahora tenés acceso a req.user.id, req.user.type, etc.
//     next();
//   } catch (error) {
//     return res.status(403).json({ message: "Token inválido o expirado" });
//   }
// }

