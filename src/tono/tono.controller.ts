import { Request, Response, NextFunction } from 'express'
import { Tono } from './tono.entity.js'
import { orm } from '../shared/orm.js'

const em = orm.em

function sanitizeTonoInput(
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
    const tono = await em.find(
      Tono,
      {}
      //{ populate: ['servicios', 'productos'] }
    )
    res.status(200).json({ message: 'found all tono', data: tono })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function tonosDeServicio(req: Request, res: Response) {
  try {
    const servicio = req.servicio;

    const tonos = await em.find(
      Tono,
      {
       // servicios: servicio,
      },
      {
        populate: ['formulas']
      }
    );

    res.status(200).json({ message: "tonos del servicio seleccionado", data: tonos });
  } catch (error: any) {
    res.status(500).json({ message: "no se encontraron tonos para el servicio seleccionado" });
  }


}

async function findOne(req: Request, res: Response) {
  try {
    const idTono = Number.parseInt(req.params.idTono);
    const tono = await em.findOne(Tono, { idTono });

    if (!tono) {
      return res.status(404).json({ message: "Tono no encontrado" });
    }

    res.status(200).json({ message: "found tono", data: tono });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}


async function add(req: Request, res: Response) {
  try {
    const tono = em.create(Tono, req.body.sanitizedInput)
    await em.flush()
    res.status(201).json({ message: 'tono created', data: tono })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function update(req: Request, res: Response) {
  try {
    const idTono = Number.parseInt(req.params.idTono)
    const turnoToUpdate = await em.findOneOrFail(Tono, { idTono })
    em.assign(turnoToUpdate, req.body.sanitizedInput)
    await em.flush()
    res
      .status(200)
      .json({ message: 'tono updated', data: turnoToUpdate })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function remove(req: Request, res: Response) {
  try {
    const idTono = Number.parseInt(req.params.idTono);
    const tono = await em.findOne(Tono, { idTono });

    if (!tono) {
      return res.status(404).json({ message: "Tono no encontrado" });
    }

    tono.formulas.removeAll();
      tono.atSers.removeAll();
    await em.flush();

    await em.removeAndFlush(tono);
    res.status(200).json({ message: "Tono eliminado correctamente" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}



export { sanitizeTonoInput, findAll, findOne, add, update, remove, tonosDeServicio }
