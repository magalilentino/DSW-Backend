import { Request, Response, NextFunction } from 'express'
import { orm } from '../shared/orm.js'
import { Persona } from './persona.entity.js'
import bcrypt from 'bcrypt';

const em = orm.em

function sanitizeClienteInput(
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

async function findAll(req: Request, res: Response) {
  try {
    const clientes = await em.find(Persona,{type: 'cliente'})
    res.status(200).json({ message: 'found all clientes', data: clientes })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const idPersona = Number.parseInt(req.params.idPersona)
    const cliente = await em.findOneOrFail(Persona,{ idPersona, type: 'cliente' })
    res.status(200).json({ message: 'found cliente', data: cliente })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function add(req: Request, res: Response) {
  try {
     // Hashear la contraseña 
    const hashedPassword = await bcrypt.hash(req.body.sanitizedInput.clave, 10);
    req.body.sanitizedInput.clave = hashedPassword;

    const cliente = em.create(Persona, req.body.sanitizedInput)
    await em.flush()
    res.status(201).json({ message: 'cliente created', data: cliente })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function update(req: Request, res: Response) {
  try {
    const idPersona = Number.parseInt(req.params.idPersona)
    const clienteToUpdate = await em.findOneOrFail(Persona, { idPersona })
    em.assign(clienteToUpdate, req.body.sanitizedInput)
    await em.flush()
    res
      .status(200)
      .json({ message: 'cliente updated', data: clienteToUpdate })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function remove(req: Request, res: Response) {
  try {
    const idPersona = Number.parseInt(req.params.idPersona)
    const cliente = await em.findOneOrFail(Persona,{ idPersona})  
    await em.removeAndFlush(cliente)
    res.status(200).send({ message: 'cliente deleted' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export { sanitizeClienteInput, findAll, findOne, add, update, remove }
