import { Request, Response, NextFunction } from 'express'
import { TonoUt} from './tonoUt.entity.js'
import { orm } from '../shared/orm.js'

const em = orm.em


export function sanitizeTonoUtInput(
  req: Request,
  res: Response,
  next: NextFunction
) {
  req.body.sanitizedInput = {
  cantidad: req.body.cantidad,
  tono: req.body.tono,
  atSer: req.body.atSer, 

  }
  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key]
    }
  })
  next()
}


export async function add(req: Request, res: Response) {
  try {
    const tonoUt = em.create(TonoUt, req.body.sanitizedInput)
    await em.flush()
    res.status(201).json({ message: 'tono utilizado created', data: tonoUt })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}