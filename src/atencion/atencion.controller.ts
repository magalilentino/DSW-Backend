import { Request, Response } from 'express';
import { orm } from '../shared/orm.js';
import { Atencion } from './atencion.entity.js';
import { Persona } from '../persona/persona.entity.js';
import { Servicio } from '../servicio/servicio.entity.js';
import { Turno } from '../turno/turno.entity.js';
import { Bloque } from '../bloque/bloque.entity.js';

/*

const em = orm.em.fork(); // fork para cada request

// ------------------- CREAR ATENCIÓN -------------------
async function crearAtencion(req: Request, res: Response) {
  try {
    const { cliente: idCliente, peluquero: idPeluquero, servicios: serviciosIds, fechaInicio } = req.body;

    if (!idCliente || !idPeluquero || !serviciosIds?.length || !fechaInicio) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    const cliente = await em.findOneOrFail(Persona, { idPersona: idCliente });
    const peluquero = await em.findOneOrFail(Persona, { idPersona: idPeluquero });

    const servicios = await em.find(Servicio, { codServicio: { $in: serviciosIds } });
    const duracionTotal = servicios.reduce((sum, s) => sum + s.cantTurnos, 0);

    // ------------------- Buscar bloques libres -------------------
    const todosBloques = await em.find(Bloque, {});
    const bloquesLibres: Bloque[] = [];

    for (const bloque of todosBloques) {
      const turnosOcupados = await em.count(Turno, { bloque, estado: { $ne: "disponible" } });
      if (turnosOcupados === 0) bloquesLibres.push(bloque);
    }

    if (bloquesLibres.length < duracionTotal) {
      return res.status(400).json({ message: "No hay suficientes bloques libres para los servicios seleccionados" });
    }

    // ------------------- Buscar bloques consecutivos -------------------
    const ordenados = bloquesLibres.sort((a, b) => a.horaInicio.localeCompare(b.horaInicio));
    let secuencia: Bloque[] = [];

    for (let i = 0; i <= ordenados.length - duracionTotal; i++) {
      const tempSeq = ordenados.slice(i, i + duracionTotal);
      const consecutivos = tempSeq.every((bl, idx) => idx === 0 || bl.horaInicio === tempSeq[idx - 1].horaFin);
      if (consecutivos) {
        secuencia = tempSeq;
        break;
      }
    }

    if (secuencia.length !== duracionTotal) {
      return res.status(400).json({ message: "No se encontraron bloques consecutivos disponibles para la duración de los servicios" });
    }

    // ------------------- Crear atención -------------------
    const atencion = new Atencion();
    atencion.cliente = cliente;
    atencion.peluquero = peluquero;
    atencion.fechaInicio = new Date(fechaInicio);
    atencion.estado = "pendiente";

    // ------------------- Asociar servicios -------------------
    for (const servicio of servicios) {
      atencion.servicios.add(servicio);
    }

    // ------------------- Crear turnos -------------------
    for (const bloque of secuencia) {
      const turno = new Turno();
      turno.estado = "pendiente";
      turno.bloque = bloque;
      turno.atencion = atencion;
      atencion.turnos.add(turno);
    }

    await em.persistAndFlush(atencion);

    return res.json({
      message: "Atención creada correctamente",
      atencionId: atencion.idAtencion,
      bloques: secuencia.map(b => ({ idBloque: b.idBloque, inicio: b.horaInicio, fin: b.horaFin })),
    });

  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: "Error al crear la atención", error: error.message });
  }
}

// ------------------- OTRAS FUNCIONES -------------------

async function findAll(req: Request, res: Response) {
  try {
    const atenciones = await em.find(Atencion, {}, { populate: ['descuentos', 'servicios', 'peluquero', 'cliente', 'turnos'] });
    res.status(200).json({ message: 'Se encontraron todas las atenciones', data: atenciones });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const idAtencion = Number(req.params.idAtencion);
    const atencion = await em.findOneOrFail(Atencion, { idAtencion }, 
      { populate: ['descuentos', 'servicios', 'peluquero', 'cliente', 'turnos'] });
    res.status(200).json({ message: 'Atención encontrada', data: atencion });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function contarTurnos(req: Request, res: Response) {
  try {
    const idAtencion = Number(req.params.idAtencion);
    const atencion = await em.findOneOrFail(Atencion, { idAtencion }, { populate: ['servicios'] });
    const totalTurnos = atencion.servicios.getItems().reduce((sum, s) => sum + s.cantTurnos, 0);
    res.status(200).json({ message: `Total de turnos para la atención ${idAtencion}`, totalTurnos });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function calcularPrecioTotal(req: Request, res: Response) {
  try {
    const idAtencion = Number(req.params.idAtencion);
    const atencion = await em.findOneOrFail(Atencion, { idAtencion }, { populate: ['servicios'] });
    const precioTotal = atencion.servicios.getItems().reduce((sum, s) => sum + s.precio, 0);
    res.status(200).json({ message: `Precio total para la atención ${idAtencion}`, precioTotal });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

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