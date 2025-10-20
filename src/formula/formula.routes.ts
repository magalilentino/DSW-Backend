import { Router } from 'express'
import { findAll, findOne, add, update, remove, sanitizeFormulaInput, formulasPorTono } from './formula.controller.js'

export const FormulaRouter = Router()


FormulaRouter.get('/', findAll)
FormulaRouter.get('/:idFormula', findOne)
FormulaRouter.post('/', sanitizeFormulaInput, add)
FormulaRouter.put('/:idFormula', sanitizeFormulaInput, update)
FormulaRouter.delete('/:idFormula', remove)
FormulaRouter.get('/formulasPorTono/:idTono', formulasPorTono)