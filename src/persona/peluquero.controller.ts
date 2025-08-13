import { Request, Response, NextFunction } from 'express'
import { orm } from '../shared/orm.js'
import { Persona } from './persona.entity.js'

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

async function findAll(req: Request, res: Response) {
  try {
    const peluqueros = await em.find(Persona,{type: 'peluquero'})
    res.status(200).json({ message: 'found all peluqueros', data: peluqueros })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const idPersona = Number.parseInt(req.params.idPersona)
    const peluquero = await em.findOneOrFail(Persona,{ idPersona, type: 'peluquero'})
    res.status(200).json({ message: 'found peluquero', data: peluquero })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function add(req: Request, res: Response) {
  try {
    const peluquero = em.create(Persona, req.body.sanitizedInput)
    //await em.flush()
    await em.persistAndFlush(peluquero)
    res.status(201).json({ message: 'peluquero created', data: peluquero })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function update(req: Request, res: Response) {
  try {
    const idPersona = Number.parseInt(req.params.idPersona)
    const peluqueroToUpdate = await em.findOneOrFail(Persona, { idPersona, type: 'peluquero' })
    em.assign(peluqueroToUpdate, req.body.sanitizedInput)
    await em.flush()
    res
      .status(200)
      .json({ message: 'peluquero updated', data: peluqueroToUpdate })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function remove(req: Request, res: Response) {
  try {
    const idPersona = Number.parseInt(req.params.idPersona)
    const peluquero = await em.findOneOrFail(Persona,{ idPersona, type: 'peluquero' })  
    await em.removeAndFlush(peluquero)
    res.status(200).send({ message: 'peluquero deleted' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export { sanitizePeluqueroInput, findAll, findOne, add, update, remove }
