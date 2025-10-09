import { Request, Response, NextFunction} from 'express'
import { Formula } from './formula.entity.js'
import { orm } from '../shared/orm.js'

const em = orm.em

function sanitizeFormulaInput(
  req: Request,
  res: Response,
  next: NextFunction
) {
  req.body.sanitizedInput = {
    cantidad: req.body.cantidad,
    productos: req.body.productos,
    tono: req.body.tono,
    
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
    const formulas = await em.find(Formula,{},{ populate: ['tono', 'productos'] })
    res.status(200).json({ message: 'found all formulas', data: formulas })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const idFormula = Number.parseInt(req.params.idFormula)
    const formula = await em.findOneOrFail(Formula,{ idFormula },{ populate: ['tono', 'productos'] })
    res.status(200).json({ message: 'found formula', data: formula })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function add(req: Request, res: Response) {
  try {
    const formula = em.create(Formula, req.body.sanitizedInput)
    await em.flush()
    res.status(201).json({ message: 'formula created', data: formula })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function update(req: Request, res: Response) {
  try {
    const idFormula = Number.parseInt(req.params.id)
    const formulaToUpdate = await em.findOneOrFail(Formula,{ idFormula })
    em.assign(formulaToUpdate, req.body.sanitizedInput)
    await em.flush()
    res
      .status(200)
      .json({ message: 'formula updated', data: formulaToUpdate })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function remove(req: Request, res: Response) {
  try {
    const idFormula= Number.parseInt(req.params.id)
    const formula = await em.findOneOrFail(Formula,{ idFormula })  
    await em.removeAndFlush(formula)
    res.status(200).send({ message: 'formula deleted' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export {sanitizeFormulaInput, findAll, findOne, add, update, remove }