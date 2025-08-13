import { Request, Response, NextFunction } from 'express'
import { Atencion } from './atencion.entity.js'
import { orm } from '../shared/orm.js'


const em = orm.em

function sanitizeAtencionInput(
  req: Request,
  res: Response,
  next: NextFunction
) {
  req.body.sanitizedInput = {
    estado: req.body.estado,
    servicios: req.body.servicios,
    cliente: req.body.cliente,
    descuentos: req.body.descuentos,
    peluquero: req.body.peluquero
    
  }
  //more checks here

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key]
    }
  })
  next()
}

async function findAll(req: Request, res: Response) {
  try {
    const atenciones = await em.find(Atencion, {},
    { populate: ['descuentos', 'servicios', 'peluquero', 'cliente'] })
    res
      .status(200)
      .json({ message: 'se encontraron todas las atenciones', data: atenciones })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const idAtencion = Number.parseInt(req.params.idAtencion)
    const atencion = await em.findOneOrFail(Atencion,{ idAtencion },  
    { populate: ['descuentos', 'servicios', 'peluquero', 'cliente'] })      //va en las relaciones que van de muchos a muchos en el owner 
    res.status(200).json({ message: 'found atencion', data: atencion })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function add(req: Request, res: Response) {
  try {
    const atencion = em.create(Atencion, req.body.sanitizedInput)
    await em.flush() 
    res
      .status(201)
      .json({ message: 'atencion creada', data: atencion })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function update(req: Request, res: Response) {
  try {
    const idAtencion = Number.parseInt(req.params.idAtencion)
    const atencionToUpdate = await em.findOneOrFail(Atencion, {idAtencion})  
    em.assign(atencionToUpdate, req.body.sanitizedInput)
    await em.flush()
    res.status(200).json({ message: 'atencion actualizada' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function remove(req: Request, res: Response) {
  try {
    const idAtencion = Number.parseInt(req.params.idAtencion)
    const atencion = await em.findOneOrFail(Atencion, {idAtencion})
    await em.removeAndFlush(atencion)
    res.status(200).send({ message: 'atencion eliminada' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function contarTurnos(req: Request, res: Response) {
  try {
    const idAtencion = Number.parseInt(req.params.idAtencion);

    const atencion = await em.findOneOrFail(Atencion, { idAtencion }, {
      populate: ['servicios'] 
    });

    const totalTurnos = atencion.servicios
      .getItems()
      .reduce((total, servicio) => total + servicio.cantTurnos, 0);

    res.status(200).json({
      message: `Total de turnos para la atención ${idAtencion}`,
      totalTurnos
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function calcularPrecioTotal(req: Request, res: Response) {
  try {
    const idAtencion = Number.parseInt(req.params.idAtencion);

    const atencion = await em.findOneOrFail(Atencion, { idAtencion }, {
      populate: ['servicios']
    });

    const precioTotal = atencion.servicios
      .getItems()
      .reduce((total, servicio) => total + servicio.precio, 0);

    res.status(200).json({
      message: `Precio total para la atención ${idAtencion}`,
      precioTotal
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}





export { sanitizeAtencionInput, findAll, findOne, add, update, remove, contarTurnos, calcularPrecioTotal }
