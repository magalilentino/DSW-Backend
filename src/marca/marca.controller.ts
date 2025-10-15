import { NextFunction, Request, Response } from 'express'
import { orm } from '../shared/orm.js'
import { Marca } from './marca.entity.js'
//import { t } from '@mikro-orm/core'

const em = orm.em

function sanitizeMarcaInput(
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
    const marcas = await em.find(Marca, {} , { populate: ['productos'] } )
    res
      .status(200)
      .json({ message: 'se encontraron todas las marcas', data: marcas })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const idMarca = Number.parseInt(req.params.idMarca)
    const marca = await em.findOneOrFail(Marca, { idMarca },
    { populate: ['productos'] }
    )   
    res
      .status(200)
      .json({ message: 'marca encontrada', data: marca })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function add(req: Request, res: Response) {
  try {
    const marca = em.create(Marca, req.body.sanitizedInput)
    await em.flush() 
    res
      .status(201)
      .json({ message: 'marca creada', data: marca })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function update(req: Request, res: Response) {
  try {
    const idMarca = Number.parseInt(req.params.idMarca)
    const marcaToUpdate = await em.findOneOrFail(Marca, {idMarca})  
    em.assign(marcaToUpdate, req.body.sanitizedInput)
    await em.flush()
    res.status(200).json({ message: 'marca actualizada' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function remove(req: Request, res: Response) {
  try {
    const idMarca = Number.parseInt(req.params.idMarca)
    const marca = await em.findOneOrFail(Marca, {idMarca})
    await em.removeAndFlush(marca)
    res.status(200).send({ message: 'marca eliminada' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export {sanitizeMarcaInput, findAll, findOne, add, update, remove }

