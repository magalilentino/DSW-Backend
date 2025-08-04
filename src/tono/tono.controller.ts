import { Request, Response, NextFunction } from 'express'
import { Tono } from './tono.entity.js'
import { orm } from '../shared/orm.js'

const em = orm.em

function sanitizeTonoInput(
  req: Request,
  res: Response,
  next: NextFunction
) {
  req.body.sanitizedInput = {
    nombre: req.body.nombre
    
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
    const tono = await em.find(
      Tono,
      {},
      //{ populate: ['servicios', 'productos'] }
    )
    res.status(200).json({ message: 'found all tono', data: tono })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const tono = await em.findOneOrFail(
      Tono,
      { id },
      //{ populate: ['productos', 'servicios'] }
    )
    res.status(200).json({ message: 'found tono', data: tono })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function add(req: Request, res: Response) {
  try {
    const tono = em.create(Tono, req.body.sanitizedInput)
    await em.flush()
    res.status(201).json({ message: 'tono created', data: tono })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const turnoToUpdate = await em.findOneOrFail(Tono, { id })
    em.assign(turnoToUpdate, req.body.sanitizedInput)
    await em.flush()
    res
      .status(200)
      .json({ message: 'tono updated', data: turnoToUpdate })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const tono = em.getReference(Tono, id)
    await em.removeAndFlush(tono)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export { sanitizeTonoInput, findAll, findOne, add, update, remove }
