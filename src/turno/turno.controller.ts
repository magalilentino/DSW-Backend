import { Request, Response, NextFunction } from 'express'
import { Turno } from './turno.entity.js'
import { orm } from '../shared/orm.js'

const em = orm.em

function sanitizeTurnoInput(
  req: Request,
  res: Response,
  next: NextFunction
) {
  req.body.sanitizedInput = {
    hora: req.body.hora,
    fecha: req.body.fecha,
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
    const turnos = await em.find(
      Turno,
      {},
      //{ populate: ['tonos', 'productos', 'precios', 'clientes'] }
    )
    res.status(200).json({ message: 'found all turnos', data: turnos })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const idTurno = Number.parseInt(req.params.idTurno)
    const turno = await em.findOneOrFail(
      Turno,
      { idTurno },
      //{ populate: ['tonos', 'productos', 'precios', 'clientes'] }
    )
    res.status(200).json({ message: 'found turno', data: turno })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function add(req: Request, res: Response) {
  try {
    const turno = em.create(Turno, req.body.sanitizedInput)
    await em.flush()
    res.status(201).json({ message: 'turno created', data: turno })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function update(req: Request, res: Response) {
  try {
    const idTurno = Number.parseInt(req.params.idTurno)
    const turnoToUpdate = await em.findOneOrFail(Turno, { idTurno })
    em.assign(turnoToUpdate, req.body.sanitizedInput)
    await em.flush()
    res
      .status(200)
      .json({ message: 'turno updated', data: turnoToUpdate })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function remove(req: Request, res: Response) {
  try {
    const idTurno = Number.parseInt(req.params.idTurno)
    const turno = await em.findOneOrFail(Turno, {idTurno})
    await em.removeAndFlush(turno)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export { sanitizeTurnoInput, findAll, findOne, add, update, remove }
