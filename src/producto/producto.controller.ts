import { Request, Response, NextFunction } from 'express'
import { Producto } from './producto.entity.js'
import { orm } from '../shared/orm.js'

const em = orm.em

function sanitizeProductoInput(
  req: Request,
  res: Response,
  next: NextFunction
) {
  req.body.sanitizedInput = {
    descripcion: req.body.descripcion,
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
    const productos = await em.find(
      Producto,
      {},
      //{ populate: ['tonos', 'productos', 'precios', 'clientes'] }
    )
    res.status(200).json({ message: 'found all producto', data: productos })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const idProducto = Number.parseInt(req.params.idProducto)
    const producto = await em.findOneOrFail(
      Producto,
      { idProducto },
      //{ populate: ['tonos', 'productos', 'precios', 'clientes'] }
    )
    res.status(200).json({ message: 'found producto', data: producto })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function add(req: Request, res: Response) {
  try {
    const producto = em.create(Producto, req.body.sanitizedInput)
    await em.flush()
    res.status(201).json({ message: 'producto created', data: producto })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function update(req: Request, res: Response) {
  try {
    const idProducto = Number.parseInt(req.params.idProducto)
    const productoToUpdate = await em.findOneOrFail(Producto, { idProducto })
    em.assign(productoToUpdate, req.body.sanitizedInput)
    await em.flush()
    res
      .status(200)
      .json({ message: 'producto updated', data: productoToUpdate })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function remove(req: Request, res: Response) {
  try {
    const idProducto = Number.parseInt(req.params.idProducto)
    const producto = em.findOneOrFail(Producto, { idProducto })
    await em.removeAndFlush(producto)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export { sanitizeProductoInput, findAll, findOne, add, update, remove }
