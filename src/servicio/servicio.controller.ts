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
    nombreServicio: req.body.nombreServicio,
    descripcion: req.body.descripcion,
    cantTurnos: Number(req.body.cantTurnos),
    precio: Number(req.body.precio),
    activo: true,
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
    console.log(input);
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

export async function findAll(req: Request, res: Response) { //req y res recibe y envia
  try { //el try maneja errores, si ocurre algo va a catch
    const servicios = await em.find(Servicio, {activo:true}, {}); //busca  los servicios con el filtro activo:true 
    res.status(200).json({ message: "found all servicios", data: servicios });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function findAllAyD(req: Request, res: Response) {
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
    servicio.activo = false; 
    await em.flush();
    return res.status(200).json({ message: `Servicio ${codServicio} eliminado correctamente` });
  } catch (error: any) {
    console.error("Error al eliminar servicio:", error);
    res.status(500).json({ message: error.message });
  }
}

export const listarServiciosPorPrecio = async (req: Request, res: Response) => {
  try {
    const min = req.query.min ? Number(req.query.min) : 0; //0 valor default minimo posible
    const max = req.query.max ? Number(req.query.max) : Number.MAX_SAFE_INTEGER; //valor default maximo posible de js
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
