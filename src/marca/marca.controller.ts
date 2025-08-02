import { Request, Response } from 'express'
import { orm } from '../shared/orm.js'
import { Marca } from './marca.entity.js'
//import { t } from '@mikro-orm/core'

const em = orm.em

async function findAll(req: Request, res: Response) {
  try {
    const marcas = await em.find(Marca, {})
    res
      .status(200)
      .json({ message: 'se encontraron todas las marcas', data: marcas })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const marca = await em.findOneOrFail(Marca, { id })   
    res
      .status(200)
      .json({ message: 'marca encontrada', data: marca })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function add(req: Request, res: Response) {
  try {
    const marca = em.create(Marca, req.body)
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
    const id = Number.parseInt(req.params.id)
    const marca = em.getReference(Marca, id)  
    await em.flush()
    res.status(200).json({ message: 'marca actualizada' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const marca = em.getReference(Marca, id)
    await em.removeAndFlush(marca)
    res.status(200).send({ message: 'marca eliminada' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export { findAll, findOne, add, update, remove }
