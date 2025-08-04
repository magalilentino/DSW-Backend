import { Request, Response, NextFunction } from 'express'
import { Descuento } from './descuento.entity.js'
import { orm } from '../shared/orm.js'

const em = orm.em

function sanitizeDescuentoInput(
  req: Request,
  res: Response,
  next: NextFunction
) {
  req.body.sanitizedInput = {
    porcentaje: req.body.nombreporcentaje,
    cantAtencionNecesaria: req.body.cantAtencionNecesaria
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
    const descuentos = await em.find(
      Descuento,
      {},
    )
    res.status(200).json({ message: 'found all escuento', data: descuentos })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const idDescuento = Number.parseInt(req.params.idDescuento)
    const descuento = await em.findOneOrFail(
      Descuento,
      { idDescuento },
      //{ populate: ['tonos', 'productos', 'precios', 'clientes'] }
    )
    res.status(200).json({ message:'found descuento', data: descuento })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function add(req: Request, res: Response) {
  try {
    const descuento = em.create(Descuento, req.body.sanitizedInput)
    await em.flush()
    res.status(201).json({ message:'descuento created', data: descuento })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function update(req: Request, res: Response) {
  try {
    const idDescuento = Number.parseInt(req.params.idDescuent)
    const descuentoToUpdate = await em.findOneOrFail(Descuento, { idDescuento })
    em.assign(descuentoToUpdate, req.body.sanitizedInput)
    await em.flush()
    res
      .status(200)
      .json({ message:'descuento updated',data: descuentoToUpdate })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function remove(req: Request, res: Response) {
  try {
    const idDescuento = Number.parseInt(req.params.idDescuento)
    const descuento = em.findOneOrFail(Descuento, { idDescuento })
    await em.removeAndFlush(descuento)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export { sanitizeDescuentoInput, findAll, findOne, add, update, remove }
