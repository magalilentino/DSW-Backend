import { Request, Response, NextFunction } from 'express'
import { Bloque } from './bloque.entity.js' 
import { orm } from '../shared/orm.js'  

const em = orm.em


async function findAllBloques(req: Request, res: Response) {
  try {
    const bloques = await em.find(
      Bloque,
      {}
    )
    res.status(200).json({ message: 'found all bloque', data: bloques })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}
/*
exports.getBloquesLibres = async (req: Request, res: Response) => {
  const { idPersona, type, fecha } = req.query;

  /*try {
    // Traer todos los bloques
    const bloques = await Bloque.findAllBloques({ order: [['hora_inicio','ASC']] });

    // Traer turnos ocupados
    const turnos = await require('./Turno').Turno.findAll({
      where: { idPersona, fecha },
      attributes: ['id_bloque']
    });
    const ocupadosIds = turnos.map(t => t.id_bloque);

    // Filtrar bloques libres
    const libres = bloques.filter(b => !ocupadosIds.includes(b.id_bloque));

    return res.json(libres);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al calcular bloques libres' });
  }
}*/
