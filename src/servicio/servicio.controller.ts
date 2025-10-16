import { Request, Response, NextFunction } from "express";
import { Servicio } from "./servicio.entity.js";
import { orm } from "../shared/orm.js";

const em = orm.em;

export function sanitizeServicioInput(
  req: Request,
  res: Response,
  next: NextFunction
) {
  req.body.sanitizedInput = {
    nombreServicio: req.body.nombre_servicio,
    descripcion: req.body.descripcion,
    cantTurnos: Number(req.body.cant_turnos),
    precio: Number(req.body.precio),
    // tiempoDemora: req.body.tiempoDemora,
    // tonos: req.body.tonos,
    // productos: req.body.productos
  };
  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key];
    }
  });
  next();
}

export async function add(req: Request, res: Response) {
  try {
    const input = req.body.sanitizedInput;
    if (
      !input.nombreServicio ||
      !input.precio ||
      input.precio <= 0 ||
      !input.cantTurnos ||
      input.cantTurnos <= 0
    ) {
      return res.status(400).json({
        message:
          "El nombre, el precio y la duración (cantTurnos) son obligatorios y deben ser valores válidos.",
      });
    }
    const servicio = em.create(Servicio, input);
    await em.flush();
    res
      .status(201)
      .json({ message: "Servicio creado con éxito", data: servicio });
  } catch (error: any) {
    res.status(500).json({
      message: "Error interno del servidor al intentar crear el servicio.",
      details: error.message,
    });
  }
}

export async function findAll(req: Request, res: Response) {
  try {
    const servicios = await em.find(Servicio, {}, {});
    res.status(200).json({ message: "found all servicios", data: servicios });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function findOne(req: Request, res: Response) {
  try {
    const codServicio = Number.parseInt(req.params.codServicio);
    const servicio = await em.findOneOrFail(Servicio, { codServicio }, {});
    res.status(200).json({ message: "found servicio", data: servicio });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function update(req: Request, res: Response) {
  try {
    const codServicio = Number.parseInt(req.params.codServicio);
    const servicioToUpdate = await em.findOneOrFail(Servicio, { codServicio });
    em.assign(servicioToUpdate, req.body.sanitizedInput);
    await em.flush();
    res
      .status(200)
      .json({ message: "servicio updated", data: servicioToUpdate });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const codServicio = Number.parseInt(req.params.codServicio);
    const servicio = await em.findOneOrFail(Servicio, { codServicio }); 
    await em.removeAndFlush(servicio);
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export const listarServiciosPorPrecio = async (req: Request, res: Response) => {
  try {
    const min = req.query.min ? Number(req.query.min) : 0;
    const max = req.query.max ? Number(req.query.max) : Number.MAX_SAFE_INTEGER;

    const servicios = await em.find(
      Servicio,
      {
        precio: { $gte: min, $lte: max }, // rango de precio
      },
      {
        fields: [
          "codServicio",
          "nombreServicio",
          "descripcion",
          "precio",
          "cantTurnos",
        ],
      }
    );

    res.json(servicios);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Detalle completo de servicios dentro del rango de precio
export const detalleServiciosPorPrecio = async (
  req: Request,
  res: Response
) => {
  try {
    const min = req.query.min ? Number(req.query.min) : 0;
    const max = req.query.max ? Number(req.query.max) : Number.MAX_SAFE_INTEGER;

    const servicios = await em.find(
      Servicio,
      {
        precio: { $gte: min, $lte: max },
      },
      {}
    );

    if (!servicios || servicios.length === 0) {
      return res
        .status(404)
        .json({ message: "No se encontraron servicios en ese rango" });
    }

    res.json(servicios);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// export async function listarProductosDeServicio(req: Request, res: Response) {
//     try {
//         // 1. Obtener el codigo del servicio desde los parámetros de la URL
//         const codServicio = Number(req.params.codServicio);
//         if (!codServicio) {
//             return res.status(400).json({ message: "Se requiere el codigo del servicio." });
//         }
//         // 2. Buscar la atención por ID y hacer 'populate' a la relación de servicios
//         const servicio = await em.findOne(
//             Servicio,
//             { codServicio : codServicio },
//             {
//                 populate: ['productos'] //trae los productos relacionados
//             }
//         );
//         // 3. Verificar si se encontró el servicio
//         if (!servicio) {
//             return res.status(404).json({ message: "Servicio no encontrado." });
//         }
//         // 4. Devolver la lista de productos
//         return res.status(200).json({
//             message: `Productos del servicio ${codServicio} listados.`,
//             data: servicio.productos //Devolvemos solo el array de productos
//         });

//     } catch (error: any) {
//         console.error(error);
//         return res.status(500).json({ message: error.message });
//     }
// }

// export async function listarTonosDeServicio(req: Request, res: Response) {
//     try {
//         // 1. Obtener el codigo del servicio desde los parámetros de la URL
//         const codServicio = Number(req.params.codServicio);
//         if (!codServicio) {
//             return res.status(400).json({ message: "Se requiere el codigo del servicio." });
//         }
//         // 2. Buscar la atención por ID y hacer 'populate' a la relación de servicios
//         const servicio = await em.findOne(
//             Servicio,
//             { codServicio : codServicio },
//             {
//                 populate: ['tonos'] //trae los tonos relacionados
//             }
//         );
//         // 3. Verificar si se encontró el servicio
//         if (!servicio) {
//             return res.status(404).json({ message: "Servicio no encontrado." });
//         }
//         // 4. Devolver la lista de tonos
//         return res.status(200).json({
//             message: `Tonos del servicio ${codServicio} listados.`,
//             data: servicio.tonos //Devolvemos solo el array de tonos
//         });

//     } catch (error: any) {
//         console.error(error);
//         return res.status(500).json({ message: error.message });
//     }
// }
