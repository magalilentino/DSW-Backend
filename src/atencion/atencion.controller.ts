import { Request, Response } from "express";
import { orm } from "../shared/orm.js";
import { Atencion } from "./atencion.entity.js";
import { Persona } from "../persona/persona.entity.js";
import { Bloque } from "../bloque/bloque.entity.js";
import { generarBloques } from "../bloque/bloque.controller.js";

const em = orm.em;

export async function crearAtencion(req: Request, res: Response) {
  try {
    const { clienteId, peluqueroId, fecha, horaInicio, duracion } = req.body;

    const cliente = await em.findOneOrFail(Persona, { idPersona: clienteId });
    const peluquero = await em.findOneOrFail(Persona, { idPersona: peluqueroId });

    const horaInicioDate = new Date(`${fecha}T${horaInicio}:00`);
    const horaFinDate = new Date(horaInicioDate.getTime() + Number(duracion) * 60000);

    const atencion = em.create(Atencion, {
      cliente,
      peluquero,
      fecha: new Date(fecha),
      horaInicio: horaInicioDate,
      horaFin: horaFinDate,
      estado: "pendiente"
    });
    await em.persistAndFlush(atencion);

    const bloquesDia = generarBloques(fecha);
    for (const b of bloquesDia) {
      const existe = await em.findOne(Bloque, {
        fecha: new Date(fecha),
        peluquero: { idPersona: peluqueroId },
        horaInicio: b.hora_inicio
      });
      if (!existe) {
        const bloque = em.create(Bloque, {
          fecha: new Date(fecha),
          horaInicio: b.hora_inicio,
          horaFin: b.hora_fin,
          peluquero,
          estado: "libre",
          atencion: null
        });
        em.persist(bloque);
      }
    }
    await em.flush();

    const bloquesOcupar = await em.find(Bloque, {
      fecha: new Date(fecha),
      peluquero: { idPersona: peluqueroId },
      horaInicio: { $gte: horaInicioDate.toTimeString().slice(0, 5) },
      horaFin: { $lte: horaFinDate.toTimeString().slice(0, 5) }
    });

    bloquesOcupar.forEach(b => {
      b.estado = "ocupado";
      b.atencion = atencion;
    });
    await em.flush();

    return res.status(201).json({ message: "Atención creada", atencion });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error al crear atención" });
  }
}

/*
function findAll(req: Request, res: Response) {
  try {
    const atenciones = await em.find(Atencion, {}, { populate: ['descuentos', 'servicios', 'peluquero', 'cliente', 'turnos'] });
    res.status(200).json({ message: 'Se encontraron todas las atenciones', data: atenciones });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

// async function findOne(req: Request, res: Response) {
//   try {
//     const idAtencion = Number(req.params.idAtencion);
//     const atencion = await em.findOneOrFail(Atencion, { idAtencion }, 
//       { populate: ['descuentos', 'servicios', 'peluquero', 'cliente', 'turnos'] });
//     res.status(200).json({ message: 'Atención encontrada', data: atencion });
//   } catch (error: any) {
//     res.status(500).json({ message: error.message });
//   }
// }

// async function contarTurnos(req: Request, res: Response) {
//   try {
//     const idAtencion = Number(req.params.idAtencion);
//     const atencion = await em.findOneOrFail(Atencion, { idAtencion }, { populate: ['servicios'] });
//     const totalTurnos = atencion.servicios.getItems().reduce((sum, s) => sum + s.cantTurnos, 0);
//     res.status(200).json({ message: `Total de turnos para la atención ${idAtencion}`, totalTurnos });
//   } catch (error: any) {
//     res.status(500).json({ message: error.message });
//   }
// }

// async function calcularPrecioTotal(req: Request, res: Response) {
//   try {
//     const idAtencion = Number(req.params.idAtencion);
//     const atencion = await em.findOneOrFail(Atencion, { idAtencion }, { populate: ['servicios'] });
//     const precioTotal = atencion.servicios.getItems().reduce((sum, s) => sum + s.precio, 0);
//     res.status(200).json({ message: `Precio total para la atención ${idAtencion}`, precioTotal });
//   } catch (error: any) {
//     res.status(500).json({ message: error.message });
//   }
// }

async function atencionesPendientes(req: Request, res: Response) {
  try {
      const idPersona = req.user?.id;
      if (!idPersona) return res.status(401).json({ message: "No se encontró el peluquero logueado" });

      const peluquero = await em.findOneOrFail(Persona, { idPersona, type: 'peluquero' });
      const atenciones = await em.find(Atencion, { peluquero, estado: 'pendiente' },
        { populate: ['descuentos', 'servicios', 'peluquero', 'cliente', 'turnos'] });
        
      res.status(200).json({ message: 'Atenciones pendientes encontradas', data: atenciones });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
  }
}

export {
  crearAtencion,
  findAll,
  findOne,
  contarTurnos,
  calcularPrecioTotal,
  atencionesPendientes
};
+*/