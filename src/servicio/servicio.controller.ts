import { Request, Response, NextFunction } from 'express'
import { Servicio } from './servicio.entity.js'
import { orm } from '../shared/orm.js'

const em = orm.em

export function sanitizeServicioInput(
  req: Request,
  res: Response,
  next: NextFunction
) {
  req.body.sanitizedInput = {
    nombreServicio: req.body.nombreServicio,
    tiempoDemora: req.body.tiempoDemora,
    tonos: req.body.tonos,
    productos: req.body.productos
  }
  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key]
    }
  })
  next()
}

export async function findAll(req: Request, res: Response) {
  try {
    const servicios = await em.find(
      Servicio,
      {},
      { populate: ['tonos', 'productos'] }
    )
    res.status(200).json({ message:'found all servicios', data: servicios })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export async function findOne(req: Request, res: Response) {
  try {
    const codServicio = Number.parseInt(req.params.codServicio)
    const servicio = await em.findOneOrFail(
      Servicio,
      { codServicio },
      { populate: ['tonos', 'productos'] }
    )
    res.status(200).json({ message:'found servicio', data: servicio })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export async function add(req: Request, res: Response) {
  try {
    const servicio = em.create(Servicio, req.body.sanitizedInput)
    await em.flush()
    res.status(201).json({ message:'servicio created', data: servicio })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export async function update(req: Request, res: Response) {
  try {
    const codServicio = Number.parseInt(req.params.codServicio)
    const servicioToUpdate = await em.findOneOrFail(Servicio, { codServicio })
    em.assign(servicioToUpdate, req.body.sanitizedInput)
    await em.flush()
    res
      .status(200)
      .json({ message:'servicio updated', data: servicioToUpdate })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const codServicio = Number.parseInt(req.params.codServicio)
    const servicio = em.findOneOrFail(Servicio, { codServicio })
    await em.removeAndFlush(servicio)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}
