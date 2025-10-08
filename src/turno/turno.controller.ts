import { Request, Response, NextFunction } from 'express'
import { Turno } from './turno.entity.js'
import { orm } from '../shared/orm.js'
import { MikroORM, EntityManager } from "@mikro-orm/core";
import { Bloque } from "../bloque/bloque.entity.js";
import { Persona } from "../persona/persona.entity.js";

const em = orm.em

function sanitizeTurnoInput(
  req: Request,
  res: Response,
  next: NextFunction
) {
  req.body.sanitizedInput = {
    fechaHora: req.body.fechaHora,
    estado: req.body.estado
    
  }
  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key]
    }
  })
  next()
}

//------------------------------------------------------------------------------------------------------
async function obtenerDisponibles(req: Request, res: Response) {
  try {
    const peluqueroId = parseInt(req.query.peluqueroId as string);
    const fecha = req.query.fecha as string;

    if (!peluqueroId || !fecha) {
      return res.status(400).json({ error: "Falta peluqueroId o fecha" });
    }

    const bloques = await em.find(Bloque, {}, { orderBy: { horaInicio: "ASC" } });

    const bloquesIds = bloques
      .map(b => b.idBloque)
      .filter((id): id is number => id !== undefined);

    const turnosOcupados = await em.createQueryBuilder(Turno, 't')
      .leftJoin('t.bloque', 'b')
      .leftJoin('t.atencion', 'a')
      .where({
        't.estado': { $in: ['pendiente', 'finalizado'] },
        'b.idBloque': { $in: bloquesIds },
        'a.peluquero': peluqueroId,
        'a.fechaInicio': fecha
      })
      .select(['b.idBloque'])
      .getResultList();

    const bloquesOcupadosIds = new Set(turnosOcupados.map(t => t.bloque.idBloque!));

    const bloquesLibres = bloques.filter(b => b.idBloque && !bloquesOcupadosIds.has(b.idBloque));

    return res.json(bloquesLibres.map(b => ({
      idBloque: b.idBloque,
      inicio: b.horaInicio,
      fin: b.horaFin
    })));

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error obteniendo bloques disponibles" });
  }
}
//------------------------------------------------------------------------------------------------------

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

export { sanitizeTurnoInput, obtenerDisponibles, findAll, findOne, add, update, remove }
