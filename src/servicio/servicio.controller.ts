import { Request, Response, NextFunction } from 'express'
import { ServicioRepository } from './servicio.repository.js'
import { Servicio } from './servicio.entity.js'

const repository = new ServicioRepository()

function sanitizeServicioInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    name: req.body.name,
    tiempoDemora: req.body.tiempoDemora
  }

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key]
    }
  })
  next()
}

async function findAll(req: Request, res: Response) {
  res.json({ data: await repository.findAll() })
}

async function findOne(req: Request, res: Response) {
  const codigo = req.params.codigo
  const servicio = await repository.findOne({ codigo })
  if (!servicio) {
    /*return*/ res.status(404).send({ message: 'Servicio not found' })
  }
  res.json({ data: servicio })
}

async function add(req: Request, res: Response) {
  const input = req.body.sanitizedInput

  const servicioInput = new Servicio (
    input.name,
    input.tiempoDemora,
    input.codigo
    
    )

  const servicio = await  repository.add(servicioInput)
  res.status(201).send({ message: 'Servicio created', data: servicio })
}


async function update(req: Request, res: Response) {
  const servicio = await repository.update(req.params.codigo, req.body.sanitizedInput)

  if (!servicio) {
    res.status(404).send({ message: 'Servicio not found' })
  } else {
    res.status(200).send({ message: 'Servicio updated successfully', data: servicio })
  }
}

async function remove(req: Request, res: Response) {
  const codigo = req.params.codigo
  const servicio = await repository.delete({ codigo })

  if (!servicio) {
    res.status(404).send({ message: 'Servicio not found' })
  } else {
    res.status(200).send({ message: 'Servicio deleted successfully' })
  }
}

export { sanitizeServicioInput, findAll, findOne, add, update, remove }