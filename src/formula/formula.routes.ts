import { Router } from 'express'
import { findAll, findOne, add, update, remove, sanitizeFormulaInput, formulasPorTono } from './formula.controller.js'
import { verificarRol, verificarToken } from '../persona/persona.controller.js'

export const FormulaRouter = Router()


FormulaRouter.get('/', findAll)
FormulaRouter.get('/:idFormula', findOne)
FormulaRouter.post('/', sanitizeFormulaInput, verificarToken, verificarRol(["peluquero"]), add)
FormulaRouter.put('/:idFormula', sanitizeFormulaInput, verificarToken, verificarRol(["peluquero"]), update)
FormulaRouter.delete('/:idFormula', verificarToken, verificarRol(["peluquero"]), remove)
FormulaRouter.get('/formulasPorTono/:idTono', verificarToken, verificarRol(["peluquero"]),formulasPorTono)