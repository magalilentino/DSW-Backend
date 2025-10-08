import { Request, Response } from 'express';
import { orm } from '../shared/orm.js';
import { Atencion } from './atencion.entity.js';
import { Bloque } from '../bloque/bloque.entity.js';
import { Persona } from '../persona/persona.entity.js';
import { Servicio } from '../servicio/servicio.entity.js';
import { Turno } from '../turno/turno.entity.js';

const em = orm.em.fork();

export const crearAtencion = async (req: Request, res: Response) => {
  try {
    const { idCliente, idPeluquero, idServicios, fecha } = req.body;

    const idClienteNum = Number(idCliente);
    const idPeluqueroNum = Number(idPeluquero);

    const cliente: Persona = await em.findOneOrFail(Persona, { idPersona: idClienteNum });
    const peluquero: Persona = await em.findOneOrFail(Persona, { idPersona: idPeluqueroNum });

    const fechaObj = new Date(fecha);
    const dia = fechaObj.getDay(); // 0 = domingo, 1 = lunes
    if (dia === 0 || dia === 1) {
      return res.status(400).json({ message: 'Solo se pueden agendar turnos de martes a sábado' });
    }

    const servicios = await em.find(Servicio, { codServicio: { $in: idServicios } });

    const cantidadBloques = servicios.reduce((sum, s) => sum + s.cantTurnos, 0);

    const bloquesLibres = await em.find(Bloque, {
      idPeluquero: idPeluqueroNum,
      fecha,
      ocupado: false
    }, { orderBy: { horaInicio: 'asc' } });

    if (bloquesLibres.length < cantidadBloques) {
      return res.status(400).json({ message: 'No hay suficientes bloques libres' });
    }

    const bloquesAsignados = bloquesLibres.slice(0, cantidadBloques);

    const horaInicio = bloquesAsignados[0].horaInicio.split(':');
    const horaInicioNum = parseInt(horaInicio[0], 10);
    const minutosInicio = parseInt(horaInicio[1], 10);
    const duracionTotal = cantidadBloques * 45; // minutos
    const horaFinTotal = horaInicioNum * 60 + minutosInicio + duracionTotal;

    if (horaInicioNum < 9 || horaFinTotal > 18 * 60) {
      return res.status(400).json({ message: 'Turno fuera del horario permitido (09:00-18:00)' });
    }

    bloquesAsignados.forEach(b => b.ocupado = true);

    const atencion = em.create(Atencion, {
      cliente,
      peluquero,
      fechaInicio: new Date(`${fecha}T${bloquesAsignados[0].horaInicio}:00`),
      estado: 'pendiente'
    });

    servicios.forEach(servicio => atencion.servicios.add(servicio));

    bloquesAsignados.forEach(bloque => {
      const turno = em.create(Turno, {
        bloque,
        atencion,
        estado: 'pendiente'
      });
      atencion.turnos.add(turno);
    });

    await em.persistAndFlush(atencion);

    res.status(201).json({ message: 'Atención creada', atencion });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
};

export const listarAtenciones = async (req: Request, res: Response) => {
  try {
    const { idPersona, type } = req.query;

    if (!idPersona || !type) {
      return res.status(400).json({ message: 'Faltan parámetros' });
    }

    const personaId = Number(idPersona);
    if (isNaN(personaId)) {
      return res.status(400).json({ message: 'idPersona inválido' });
    }

    let atenciones;

    if (type === 'cliente') {
      // Filtramos usando la relación ManyToOne correctamente
      atenciones = await em.find(
        Atencion,
        { cliente: { idPersona: personaId } },
        { populate: ['servicios', 'turnos', 'peluquero', 'descuentos', 'pagos'] }
      );
    } else if (type === 'peluquero') {
      atenciones = await em.find(
        Atencion,
        { peluquero: { idPersona: personaId } },
        { populate: ['servicios', 'turnos', 'cliente', 'descuentos', 'pagos'] }
      );
    } else {
      return res.status(400).json({ message: 'Tipo inválido. Debe ser "cliente" o "peluquero".' });
    }

    res.json({ data: atenciones });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al listar atenciones' });
  }
};

/* 
function findAll(req: Request, res: Response) {
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
*/