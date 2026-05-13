import { Request, Response } from "express";
import { orm } from "../shared/orm.js";
import { Atencion } from "./atencion.entity.js";
import { Persona } from "../persona/persona.entity.js";
import { Bloque } from "../bloque/bloque.entity.js";
import { generarBloques } from "../bloque/bloque.controller.js";
import { AtSer } from "../atencion-servicio/atSer.entity.js";
import { Servicio } from "../servicio/servicio.entity.js";
import { DateTime } from "luxon";
import { sendDiscountMail, sendVisitPreparationMail } from "../mailer.js";
import { Descuento } from "../descuento/descuento.entity.js";
import { validarUsuarioLogueado } from './validarTurnosHoy.js';

const em = orm.em;

export async function crearAtencion(req: Request, res: Response) {
  try {
    const { clienteId, peluqueroId, fecha, horaInicio, duracion, servicios } = req.body;//, idDescuento

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
      estado: "pendiente",
      descripcion: ""
    });

    // --- LÓGICA DE DESCUENTO ---
    // if (idDescuento) {
    //   // Buscamos el descuento por su ID para vincularlo
    //   const descuentoExistente = await em.findOne(Descuento, { idDescuento });
    //   if (descuentoExistente) {
    //     // Importante: Asegúrate de que en tu entidad Atencion, 
    //     // la relación se llame 'descuentos'
    //     atencion.descuentos.add(descuentoExistente);
    //   }
    // }

    await em.persistAndFlush(atencion);

    // --- LÓGICA DE SERVICIOS ---
    if (Array.isArray(servicios)) {
      let requierePreparacion = false;
      for (const codServicio of servicios) {
        const servicio = await em.findOneOrFail(Servicio, { codServicio });
        const atSer = new AtSer();
        atSer.atencion = atencion;
        atSer.servicio = servicio;
        atencion.atencionServicios.add(atSer);
        if (servicio.requiereTono) {
          requierePreparacion = true
        }
      }
      await em.persistAndFlush(atencion);
      if (requierePreparacion) {
        await sendVisitPreparationMail(cliente.email);
      }
    }

    // --- LÓGICA DE BLOQUES (GENERACIÓN Y OCUPACIÓN) ---
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

    const atencionConServicios = await em.findOneOrFail(
      Atencion,
      { idAtencion: atencion.idAtencion },
      { populate: ["cliente", "peluquero", "atencionServicios", "atencionServicios.servicio"] }//, "descuentos"
    );

    return res.status(201).json({
      message: "Atención creada con éxito",
      atencion: atencionConServicios
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error al crear atención" });
  }
}

export async function atencionesPendientes(req: Request, res: Response) {
  try {
    const idPersona = req.user?.id;
    if (!idPersona) {
      return res.status(401).json({ message: "No se encontró el peluquero logueado" });
    }
    const peluquero = await em.findOneOrFail(Persona, { idPersona, type: "peluquero" });
    const atenciones = await em.find(
      Atencion,
      { peluquero, estado: "pendiente" },
      { populate: ["atencionServicios", "atencionServicios.servicio", "peluquero", "cliente"] }
    );

    res.status(200).json({ message: "Se encontraron todas las atenciones pendientes", data: atenciones });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function cancelarAtencion(req: Request, res: Response) {
  try {

    const idAtencionString = req.params.idAtencion as string;
    const idAtencion = parseInt(idAtencionString, 10);

    if (isNaN(idAtencion) || idAtencion <= 0) {
      return res.status(400).json({ message: "ID de Atención no válido." });
    }

    const atencion = await em.findOneOrFail(Atencion, { idAtencion });

    atencion.estado = "cancelado";

    await em.persistAndFlush(atencion);

    return res.status(200).json({
      message: `Atención ${idAtencion} cancelada exitosamente.`,
      idAtencion: atencion.idAtencion
    });

  } catch (error: any) {

    console.error("Error al cancelar atención:", error);

    if (error.name === 'NotFoundError') {
      return res.status(404).json({ message: `Atención con ID ${req.params.idAtencion} no encontrada.` });
    }
    return res.status(500).json({ message: "Error interno del servidor al cancelar la atención.", error: error.message });
  }
}

export async function finalizarAtencion(req: Request, res: Response) {
  try {
    const idAtencion = parseInt(req.params.idAtencion as string, 10);
    const descripcion = req.body as { descripcion?: string };

    if (isNaN(idAtencion) || idAtencion <= 0) {
      return res.status(400).json({ message: "ID de Atención no válido." });
    }

    const atencion = await em.findOneOrFail(Atencion, { idAtencion }, { populate: ['cliente'] });

    atencion.estado = "finalizado";
    if (descripcion) {
      atencion.descripcion = descripcion as any;
    }

    await em.persistAndFlush(atencion);

    const cliente = atencion.cliente;

    const desbloqueados: number[] = await obtenerDescuentos(cliente);

    if (desbloqueados.length > 0) {
      await sendDiscountMail(cliente.email, desbloqueados);
    }

    return res.status(200).json({
      message: `Atención ${idAtencion} registrada como finalizada.`
    });

  } catch (error: any) {
    return res.status(500).json({ message: "Error al finalizar atención" });
  }
}

async function obtenerDescuentos(cliente:Persona, validarPendientes: boolean = false) {
  if (validarPendientes) {
    const pendientes = await em.count(Atencion, { cliente, estado: "pendiente" });
    if (pendientes > 0) {
      return []; 
    }
  }
  const totalAtenciones = await em.count(Atencion, { cliente, estado: "finalizado" });
  const descuentos = await em.find(Descuento, { estado: true });

  const desbloqueados: number[] = [];

  for (const d of descuentos) {
    if (totalAtenciones % d.cantAtencionNecesaria == 0) {
      desbloqueados.push(d.porcentaje);
    }
  }

  return desbloqueados;
}

export async function getHistoricoByCliente(req: Request, res: Response) {
  try {
    const idPersona = Number(req.params.idPersona);

    const atenciones = await em.find(
      Atencion,
      { cliente: { idPersona }, estado: { $in: ["finalizado", "cancelado"] } },
      {
        populate: [
          "peluquero",
          "atencionServicios",
          "atencionServicios.servicio"
        ],
        orderBy: { fecha: "DESC" }
      }
    );

    const result = atenciones.map(a => ({
      idAtencion: a.idAtencion,
      fecha: a.fecha,
      horaInicio: a.horaInicio,
      horaFin: a.horaFin,
      estado: a.estado,
      peluquero: a.peluquero,
      atencionServicios: a.atencionServicios.getItems().map(as => ({
        idAtSer: as.idAtSer,
        servicio: as.servicio
      }))
    }));

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al obtener el histórico de atenciones" });
  }
}


export async function getPendientesByCliente(req: Request, res: Response) {
  try {
    const idPersona = Number(req.params.idPersona);

    const atenciones = await em.find(
      Atencion,
      { cliente: { idPersona }, estado: "pendiente" },
      {
        populate: [
          "peluquero",
          "atencionServicios",
          "atencionServicios.servicio"
        ]
      }
    );

    const result = atenciones.map(a => ({
      idAtencion: a.idAtencion,
      fecha: a.fecha,
      horaInicio: a.horaInicio,
      horaFin: a.horaFin,
      estado: a.estado,
      peluquero: a.peluquero,
      atencionServicios: a.atencionServicios.getItems().map(as => ({
        idAtSer: as.idAtSer,
        servicio: as.servicio
      }))
    }));

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al obtener las atenciones pendientes" });
  }
}

export async function atencionesPendientesHoy(req: Request, res: Response) {
  try {
    const idPersona = req.user?.id;   // Obtener el id del peluquero desde el token
    if (!idPersona) {
      return res.status(401).json({ message: "No se encontró el peluquero logueado" });
    }
    const peluquero = await em.findOneOrFail(Persona, { idPersona, type: "peluquero" });
    const hoy = DateTime.now().setZone("America/Argentina/Buenos_Aires").startOf("day").toJSDate();
    const manana = DateTime.now().setZone("America/Argentina/Buenos_Aires").endOf("day").toJSDate();
    const atenciones = await em.find(
      Atencion,
      {
        peluquero: { idPersona: peluquero.idPersona },
        estado: "pendiente",
        horaInicio: { $gte: hoy, $lt: manana },
      },
      {
        populate: ["cliente", "atencionServicios", "atencionServicios.servicio"],
      }
    );
    res.status(200).json({ count: atenciones.length });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: err.message || "Error al obtener atenciones pendientes de hoy" });
  }
}

export async function atencionesCompletadasHoy(req: Request, res: Response) {
  try {
    const idPersona = req.user?.id;
    if (!idPersona) return res.status(401).json({ message: "No se encontró el peluquero logueado" });

    const peluquero = await em.findOneOrFail(Persona, { idPersona, type: "peluquero" });

    const hoy = DateTime.now().setZone("America/Argentina/Buenos_Aires").startOf("day").toJSDate();
    const manana = DateTime.now().setZone("America/Argentina/Buenos_Aires").endOf("day").toJSDate();

    const atenciones = await em.find(
      Atencion,
      {
        peluquero: { idPersona: peluquero.idPersona },
        estado: "finalizado",
        horaInicio: { $gte: hoy, $lt: manana },
      },
      { populate: ["cliente", "atencionServicios", "atencionServicios.servicio"] }
    );

    res.status(200).json({ count: atenciones.length });
  } catch (err: any) {
    console.error("Error al obtener atenciones completadas de hoy:", err);
    res.status(500).json({ message: err.message || "Error al obtener atenciones completadas de hoy" });
  }
}

export async function gananciasHoy(req: Request, res: Response) {
  try {
    const idPersona = req.user?.id;
    if (!idPersona) return res.status(401).json({ message: "No se encontró el peluquero logueado" });

    const peluquero = await em.findOneOrFail(Persona, { idPersona, type: "peluquero" });

    const hoy = DateTime.now().setZone("America/Argentina/Buenos_Aires").startOf("day").toJSDate();
    const manana = DateTime.now().setZone("America/Argentina/Buenos_Aires").endOf("day").toJSDate();

    const atenciones = await em.find(
      Atencion,
      {
        peluquero: { idPersona: peluquero.idPersona },
        estado: "finalizado",
        horaInicio: { $gte: hoy, $lt: manana },
      },
      { populate: ["atencionServicios", "atencionServicios.servicio"] }
    );

    let total = 0;
    for (const at of atenciones) {
      for (const atSer of at.atencionServicios.getItems()) {
        const servicio = atSer.servicio;
        if (servicio?.precio) total += Number(servicio.precio);
      }
    }

    res.status(200).json({ total });
  } catch (err: any) {
    console.error("Error al calcular ganancias del día:", err);
    res.status(500).json({ message: err.message || "Error al calcular ganancias del día" });
  }
}

export async function turnosHoy(req: Request, res: Response) {
  try {
    // const idPersona = req.user?.id;
    // if (!idPersona) return res.status(401).json({ message: "No se encontró el peluquero logueado" });

    const validacion = validarUsuarioLogueado(req.user);
    if (!validacion.valido) {
      return res.status(validacion.status).json({ message: validacion.message });
    }
    const idPersona = validacion.valido ? req.user!.id : 0;


    const peluquero = await em.findOneOrFail(Persona, { idPersona, type: "peluquero" });

    const hoy = DateTime.now().setZone("America/Argentina/Buenos_Aires").startOf("day").toJSDate();
    const manana = DateTime.now().setZone("America/Argentina/Buenos_Aires").endOf("day").toJSDate();
    const servicioFiltro = req.query.servicio ? Number(req.query.servicio): undefined;

    // 🔹 Filtros base
    const filtros: any = {
      peluquero: { idPersona: peluquero.idPersona },
      estado: "pendiente",
      horaInicio: { $gte: hoy, $lt: manana },
    };

    // 🔹 Filtro por servicio (solo si viene)
    if (servicioFiltro) {
      filtros.atencionServicios = {
        servicio: {
          codServicio: servicioFiltro,
        },
      };
    }

    const atenciones = await em.find(
      Atencion, filtros,
      {
      populate: [
        "cliente",
        "atencionServicios",
        "atencionServicios.servicio",
      ],
      orderBy: { horaInicio: "ASC" },
    });

    const result = atenciones.map(a => ({
      hora: DateTime.fromJSDate(a.horaInicio).setZone("America/Argentina/Buenos_Aires").toFormat("HH:mm"),
      cliente: `${a.cliente.nombre} ${a.cliente.apellido}`,
      servicios: a.atencionServicios.getItems().map(as => as.servicio?.nombreServicio ?? "Sin nombre").join(", ")
    }));

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al obtener turnos del día" });
  }
}

export async function verificarDescuentoCliente(req: Request, res: Response) {
  try {
    const idPersona = Number(req.params.idPersona);
    const servicios = req.body.servicios; 
    if (!Array.isArray(servicios)) {
      return res.status(400).json({ message: "Servicios requeridos" });
    }

    const cliente = await em.findOneOrFail(Persona, { idPersona });

    const desbloqueados: number[] = await obtenerDescuentos(cliente, true);

    let subtotal = 0;
    for (const codServicio of servicios) {
      const servicio = await em.findOneOrFail(Servicio, { codServicio });
      subtotal += servicio.precio;
    }

    let precioFinal = subtotal;
    let maxDescuento = null;
    if (desbloqueados.length > 0) {
      // si hay varios descuentos, aplico solo el de mayor valor.
      maxDescuento = Math.max(...desbloqueados);
      precioFinal -= (subtotal * maxDescuento / 100);
    }

    return res.status(200).json({
      aplicaDescuento: maxDescuento !== null,
      porcentaje: maxDescuento,
      subtotal,
      precioTotal: precioFinal
    });
    
   
    // if (descuentoParaAplicar) {
    //   return res.status(200).json({
    //     aplicaDescuento: true,
    //     descuento: descuentoParaAplicar
    //   });
    // }

    // // Si no aplica, calculamos cuánto falta para el descuento más cercano
    // // (Opcional, pero sirve para darle feedback al usuario en el front)
    // return res.status(200).json({
    //   aplicaDescuento: false,
    //   descuento: null,
    //   visitasActuales: totalFinalizadas
    // });

  } catch (error: any) {
    console.error("Error en verificarDescuentoCliente:", error);
    return res.status(500).json({ message: error.message });
  }
}