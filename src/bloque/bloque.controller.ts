import { Request, Response } from 'express';
import { orm } from '../shared/orm.js';
import { Bloque } from './bloque.entity.js';

const em = orm.em;

export const getBloquesLibres = async (req: Request, res: Response) => {
  const idPeluquero = Number(req.query.idPeluquero);
  const fecha = req.query.fecha as string;

  try {
    const bloques = await em.find(Bloque, {}, { populate: ['turnos.atencion.peluquero'] });

    const bloquesLibres = bloques.filter(bloque => 
      !bloque.turnos.getItems().some(turno => {
        const atencion = turno.atencion;

        if (!atencion || !atencion.peluquero) return false;

        const turnoFechaStr = atencion.fechaInicio instanceof Date
          ? atencion.fechaInicio.toISOString().slice(0, 10)
          : atencion.fechaInicio;

        return atencion.peluquero.idPersona === idPeluquero && turnoFechaStr === fecha;
      })
    );

    return res.json(bloquesLibres);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener bloques libres' });
  }
};
