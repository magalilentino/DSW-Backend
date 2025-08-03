import { Request, Response, NextFunction } from 'express'
import { Pago } from './pago.entity.js'
import { orm } from '../shared/orm.js'

const em = orm.em

function sanitizePagoInput(
  req: Request,
  res: Response,
  next: NextFunction
) {
  req.body.sanitizedInput = {//creo que esto no hace falta sanitizarlo si no pasa por el cliente
    metodo: req.body.metodo, 
    total: req.body.total,
    estado: req.body.estado
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
    const pagos = await em.find(
      Pago,
      {},
      //{ populate: ['tonos', 'productos', 'precios', 'clientes'] }
    )
    res.status(200).json({ message: 'found all pago', data: pagos })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const nroPago = Number.parseInt(req.params.nroPago)
    const pago = await em.findOneOrFail(
      Pago,
      { nroPago },
      //{ populate: ['tonos', 'productos', 'precios', 'clientes'] }
    )
    res.status(200).json({ message: 'found pago', data: pago })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function add(req: Request, res: Response) {
  try {
    const pago = em.create(Pago, req.body.sanitizedInput)
    await em.flush()
    res.status(201).json({ message: 'pago created', data: pago })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function update(req: Request, res: Response) {
  try {
    const nroPago = Number.parseInt(req.params.nroPago)
    const pagoToUpdate = await em.findOneOrFail(Pago, { nroPago })
    em.assign(pagoToUpdate, req.body.sanitizedInput)
    await em.flush()
    res
      .status(200)
      .json({ message: 'pago updated', data: pagoToUpdate })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function remove(req: Request, res: Response) {
  try {
    const nroPago = Number.parseInt(req.params.nroPago)
    const pago = em.findOneOrFail(Pago, { nroPago })
    await em.removeAndFlush(pago)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export { sanitizePagoInput, findAll, findOne, add, update, remove }
