import { Request, Response, NextFunction } from 'express'
import { orm } from '../shared/orm.js'
import { Bloque } from "../bloque/bloque.entity.js";

/*function sanitizeTurnoInput(
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
}*/


const em = orm.em.fork();

export const obtenerDisponibles = async (req: Request, res: Response) => {
  try {
    const idPeluquero = Number(req.query.peluqueroId);
    const fecha = req.query.fecha as string;

    if (!idPeluquero || !fecha) {
      return res.status(400).json({ message: 'Faltan parámetros: peluqueroId o fecha' });
    }

    // Buscamos los bloques libres para ese peluquero y fecha
    const bloques = await em.find(Bloque, {
      idPeluquero,
      fecha,
      ocupado: false
    }, { orderBy: { horaInicio: 'asc' } });

    // Formateamos para el frontend
    const bloquesFormateados = bloques.map(b => ({
      idBloque: b.id,
      inicio: b.horaInicio,
      fin: b.horaFin
    }));

    res.json(bloquesFormateados);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener bloques disponibles' });
  }
};

//------------------------------------------------------------------------------------------------------
/* 
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
*/