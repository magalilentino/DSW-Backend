import { Request, Response } from 'express';
import { orm } from '../shared/orm.js';
import { Bloque } from './bloque.entity.js';
import { Persona } from '../persona/persona.entity.js';

const em = orm.em.fork();

// Generar bloques de 9 a 18 hs de martes a sábado
export const generarBloques = async (req: Request, res: Response) => {
  try {
    const peluqueros = await em.find(Persona, { type: 'peluquero' });
    const dias = ['2025-10-07', '2025-10-08', '2025-10-09', '2025-10-10', '2025-10-11']; // ejemplo
    const bloquesDia = [];

    for (const dia of dias) {
      for (const peluquero of peluqueros) {
        let hora = 9;
        while (hora < 18) {
          const inicio = `${hora.toString().padStart(2, '0')}:00`;
          const finHora = hora + 0.75; // 45 min
          const minutos = (finHora % 1) * 60;
          const fin = `${Math.floor(finHora).toString().padStart(2, '0')}:${minutos === 0 ? '00' : '45'}`;

          const bloque = em.create(Bloque, {
            fecha: dia,
            horaInicio: inicio,
            horaFin: fin,
            idPeluquero: peluquero.idPersona!,
            ocupado: false
          });
          bloquesDia.push(bloque);

          hora += 0.75; // 45 min
        }
      }
    }

    await em.persistAndFlush(bloquesDia);
    res.json({ message: 'Bloques generados correctamente' });
  } catch (error) {
    res.status(500).json({ error });
  }
};

// Listar bloques libres de un peluquero en una fecha
export const getBloquesLibres = async (req: Request, res: Response) => {
  try {
    const idPeluquero = Number(req.query.idPeluquero);
    const fecha = req.query.fecha as string;

    const bloques = await em.find(Bloque, {
      idPeluquero,
      fecha,
      ocupado: false
    }, { orderBy: { horaInicio: 'asc' } });

    res.json(bloques);
  } catch (error) {
    res.status(500).json({ error });
  }
};
