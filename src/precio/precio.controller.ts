import { Request, Response, NextFunction } from 'express'
import { Precio } from './precio.entity.js'
import { orm } from '../shared/orm.js'

const em = orm.em

function sanitizePrecioInput(
  req: Request,
  res: Response,
  next: NextFunction
) {
  req.body.sanitizedInput = {
    fechaImporte: req.body.fechaImporte,
    servicio: req.body.servicio,
    importe: req.body.importe,
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
    const precios = await em.find(
      Precio,
      {},
      { populate: ['servicio'] }
    )
    res.status(200).json({ message: 'found all precios', data: precios })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const fechaImporte = new Date(req.params.fechaImporte)
    const precio = await em.findOneOrFail(
      Precio,
      { fechaImporte },
      { populate: ['servicio']}
    )
    res.status(200).json({ message: 'found precio', data: precio })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function add(req: Request, res: Response) {
  try {
    const precio = em.create(Precio, req.body.sanitizedInput)
    await em.flush()
    res.status(201).json({ message: 'precio created', data: precio })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function update(req: Request, res: Response) {
  try {
    const fechaImporte = new Date(req.params.fechaImporte)
    const precioToUpdate = await em.findOneOrFail(Precio, { fechaImporte })
    em.assign(precioToUpdate, req.body.sanitizedInput)
    await em.flush()
    res
      .status(200)
      .json({ message: 'precio updated', data: precioToUpdate })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function remove(req: Request, res: Response) {
  try {
    const fechaImporte = new Date(req.params.fechaImporte)
    const precio = await em.findOneOrFail(Precio, { fechaImporte })
    await em.removeAndFlush(precio)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export { sanitizePrecioInput, findAll, findOne, add, update, remove }