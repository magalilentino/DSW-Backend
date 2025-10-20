import { Request, Response, NextFunction } from 'express'
import { Tono } from './tono.entity.js'
import { orm } from '../shared/orm.js'
import { ProdMar } from '../productos-marcas/prodMar.entity.js'
import { Formula } from '../formula/formula.entity.js'

const em = orm.em

function sanitizeTonoInput(
  req: Request,
  res: Response,
  next: NextFunction
) {
  req.body.sanitizedInput = {
    nombre: req.body.nombre,
    activo: true,
    
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

async function findAllActivos(req: Request, res: Response) {
  try {
    const tono = await em.find(
      Tono,
      {activo:true}
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
      },{populate: ['formulas']}
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
    const { nombre, formulas } = req.body;

    if (!nombre || !Array.isArray(formulas)) {
      return res.status(400).json({ message: "Datos inválidos" });
    }

    const nuevoTono = new Tono();
    nuevoTono.nombre = nombre;
    nuevoTono.activo = true;

    // Crear fórmulas asociadas
    for (const f of formulas) {
      const prodMar = await em.findOne(ProdMar, { idPM: f.idPM });
      if (!prodMar) {
        return res.status(404).json({ message: `ProdMar ${f.idPM} no encontrado` });
      }

      const formula = new Formula();
      formula.cantidad = f.cantidad;
      formula.activo = true;
      formula.prodMar = prodMar;
      formula.tono = nuevoTono;

      nuevoTono.formulas.add(formula); // opcional, si querés mantener la relación bidireccional
      await em.persist(formula);
    }

    await em.persist(nuevoTono);
    await em.flush();

    return res.status(201).json({ message: "Tono creado con fórmulas", data: nuevoTono });
  } catch (error: any) {
    console.error("Error al crear tono:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
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
    const tono = await em.findOne(Tono, { idTono }, { populate: ['formulas'] });

    if (!tono) {
      return res.status(404).json({ message: "Tono no encontrado" });
    }

    tono.activo = false;
    
    for (const f of tono.formulas) {
      f.activo = false;
       await em.flush();
    }
    await em.flush();

    res.status(200).json({ message: "Tono eliminado correctamente" });
  } catch (error: any) {
    console.log(error)
    res.status(500).json({ message: error.message });
  }
}



export { sanitizeTonoInput, findAll, findOne, add, update, remove, tonosDeServicio, findAllActivos }
