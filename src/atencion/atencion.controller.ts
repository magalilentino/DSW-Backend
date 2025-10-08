import { Request, Response, NextFunction } from 'express'
import { Atencion } from './atencion.entity.js'
//import { findOnePeluquero } from "../persona/peluquero/peluquero.controller.js";
import { orm } from '../shared/orm.js'
import { Persona } from '../persona/persona.entity.js';
import { Servicio } from '../servicio/servicio.entity.js';



const em = orm.em

async function sanitizeAtencionInput(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const idPersona = req.user?.id; 
    const cliente = await em.findOneOrFail(Persona,{ idPersona, type: 'cliente' });

    if (!idPersona) {
      return res.status(401).json({ message: "No se encontró la persona logueado" });
    }
  
  req.body.sanitizedInput = {
    estado: "pendiente",
    servicios: req.body.servicios,
    cliente: cliente,
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

async function atencionesPendientes(req: Request, res: Response) {
  try {
    const idPersona = req.user?.id; 

    if (!idPersona) {
      return res.status(401).json({ message: "No se encontró el peluquero logueado" });
    }

    const peluquero = await em.findOneOrFail(Persona,{ idPersona, type: 'peluquero' });

    const atenciones = await em.find(
      Atencion,
      {
        peluquero: peluquero,
        estado: "pendiente"
      },
      {
        populate: ['descuentos', 'servicios', 'peluquero', 'cliente']
      }
    );

    res.status(200).json({ message: "se encontraron todas las atenciones pendientes", data: atenciones });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }


}

export async function confirmarAtencion (req: Request, res:Response) {
  const codServicio = Number.parseInt(req.params.codServicio)
  const servicio = await em.findOneOrFail(Servicio, {codServicio})

  req.servicio = servicio;

}

export async function cancelarAtencion(req: Request, res:Response) {
  const idAtencion = Number.parseInt(req.params.idAtencion)
  const atencion = await em.findOneOrFail(Atencion, {idAtencion})

  atencion.estado = "cancelado";

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
    //const atencion = em.create(Atencion, {...req.body.sanitizedInput,cliente});

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


export async function listarServiciosDeAtencion(req: Request, res: Response) {
    try {
        // 1. Obtener el ID de la Atención desde los parámetros de la URL
        const idAtencion = Number(req.params.idAtencion); 
        if (!idAtencion) {
            return res.status(400).json({ message: "Se requiere el ID de la atención." });
        }
        // 2. Buscar la atención por ID y hacer 'populate' a la relación de servicios
        const atencion = await em.findOne(
            Atencion,
            { idAtencion : idAtencion }, 
            { 
                populate: ['servicios'] //trae los servicios relacionados
            }
        );
        // 3. Verificar si se encontró la atención
        if (!atencion) {
            return res.status(404).json({ message: "Atención no encontrada." });
        }
        // 4. Devolver la lista de servicios (que viene dentro del objeto 'atencion')
        return res.status(200).json({ 
            message: `Servicios de la atención ${idAtencion} listados.`,
            data: atencion.servicios //Devolvemos solo el array de servicios
        });

    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
}





export { sanitizeAtencionInput, findAll, findOne, add, update, remove, contarTurnos, calcularPrecioTotal, atencionesPendientes }
