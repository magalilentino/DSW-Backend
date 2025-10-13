import { Request, Response } from "express";
import { orm } from "../shared/orm.js";
import { Atencion } from "./atencion.entity.js";
import { Persona } from "../persona/persona.entity.js";
import { Bloque } from "../bloque/bloque.entity.js";
import { generarBloques } from "../bloque/bloque.controller.js";
import { AtSer } from "../atencion-servicio/atSer.entity.js";
import { Servicio } from "../servicio/servicio.entity.js";

const em = orm.em;

export async function crearAtencion(req: Request, res: Response) {
  try {
    const { clienteId, peluqueroId, fecha, horaInicio, duracion, servicios } = req.body;

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
    await em.persistAndFlush(atencion);

  
    if (Array.isArray(servicios)) {
      for (const codServicio of servicios) {
        const servicio = await em.findOneOrFail(Servicio, { codServicio });
        const atSer = new AtSer();
        atSer.atencion = atencion;
        atSer.servicio = servicio;
        atencion.atencionServicios.add(atSer);
      }
      await em.persistAndFlush(atencion);
    }

   
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
      {
        populate: [
          "cliente",
          "peluquero",
          "atencionServicios",
          "atencionServicios.servicio"
        ]
      }
    );

    console.log(JSON.stringify(atencionConServicios, null, 2));

    return res.status(201).json({
      message: "Atención creada con servicios",
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
      { populate: ["descuentos", "atencionServicios", "atencionServicios.servicio", "peluquero", "cliente"] }
    );

    res.status(200).json({ message: "Se encontraron todas las atenciones pendientes", data: atenciones });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export async function cancelarAtencion(req: Request, res: Response) {
    try {
        // Obtener y convertir la ID de la Atención a número (Viene como string de req.params)
        const idAtencionString = req.params.idAtencion as string;
        const idAtencion = parseInt(idAtencionString, 10);

        // Validación
        if (isNaN(idAtencion) || idAtencion <= 0) {
            return res.status(400).json({ message: "ID de Atención no válido." });
        }

        // 2. Buscar la Atención por ID
        // Usamos findOneOrFail para asegurar que existe
        const atencion = await em.findOneOrFail(Atencion, { idAtencion });

        // 3. Actualizar el estado
        atencion.estado = "cancelado"; 

        // 4. Persistir los cambios en la base de datos
        // Usamos em.flush() para ejecutar la operación UPDATE
        await em.persistAndFlush(atencion);

        // 5. Respuesta exitosa
        return res.status(200).json({ 
            message: `Atención ${idAtencion} cancelada exitosamente.`,
            idAtencion: atencion.idAtencion
        });

    } catch (error: any) {
        // Manejar errores si no se encuentra la atención (findOneOrFail lanza error) 
        // o si hay un fallo en la DB.
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
        const descripcion = req.body as { descripcion?: string}

        if (isNaN(idAtencion) || idAtencion <= 0) {
            return res.status(400).json({ message: "ID de Atención no válido." });
        }

        const atencion = await em.findOneOrFail(Atencion, { idAtencion });

        // 1. Cambiar el estado
        atencion.estado = "finalizado"; 
        if(descripcion){
          atencion.descripcion = descripcion as any;
        }

        await em.persistAndFlush(atencion);

        return res.status(200).json({ 
            message: `Atención ${idAtencion} registrada como finalizada.`
        });

    } catch (error: any) {
        console.error("Error al finalizar atención:", error);
        return res.status(500).json({ message: "Error interno del servidor." });
    }
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


// async function confirmarAtencion (req: Request, res:Response) {
//   const codServicio = Number.parseInt(req.params.codServicio)
//   const servicio = await em.findOneOrFail(Servicio, {codServicio})

//   req.servicio = servicio;

// }


/*
function findAll(req: Request, res: Response) {
  try {
    const atenciones = await em.find(Atencion, {},
    { populate: ['descuentos', 'atencionServicios', 'peluquero', 'cliente'] })
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
    { populate: ['descuentos', 'atencionServicios', 'peluquero', 'cliente'] })      //va en las relaciones que van de muchos a muchos en el owner 
    res.status(200).json({ message: 'found atencion', data: atencion })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

// async function add(req: Request, res: Response) {
//   try {
//     const atencion = em.create(Atencion, req.body.sanitizedInput)
//     const atencion = em.create(Atencion, {...req.body.sanitizedInput,cliente});

//     await em.flush() 
//     res
//       .status(201)
//       .json({ message: 'atencion creada', data: atencion })
//   } catch (error: any) {
//     console.error(error);
//     return res.status(500).json({ message: "Error al crear la atención", error: error.message });
//   }
// }
//------------------- OTRAS FUNCIONES -------------------

// async function findAll(req: Request, res: Response) {
//   try {
//     const atenciones = await em.find(Atencion, {}, { populate: ['descuentos', 'servicios', 'peluquero', 'cliente', 'turnos'] });
//     res.status(200).json({ message: 'Se encontraron todas las atenciones', data: atenciones });
//   } catch (error: any) {
//     res.status(500).json({ message: error.message });
//   }
// }

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
//     const atencion = await em.findOneOrFail(Atencion, { idAtencion }, { populate: ['atencionServicios'] });
//     const totalTurnos = atencion.servicios.getItems().reduce((sum, s) => sum + s.cantTurnos, 0);
//     res.status(200).json({ message: `Total de turnos para la atención ${idAtencion}`, totalTurnos });
//   } catch (error: any) {
//     res.status(500).json({ message: error.message });
//   }
// }

// async function calcularPrecioTotal(req: Request, res: Response) {
//   try {
//     const idAtencion = Number(req.params.idAtencion);
//     const atencion = await em.findOneOrFail(Atencion, { idAtencion }, { populate: ['atencionServicios'] });
//     const precioTotal = atencion.servicios.getItems().reduce((sum, s) => sum + s.precio, 0);
//     res.status(200).json({ message: `Precio total para la atención ${idAtencion}`, precioTotal });
//   } catch (error: any) {
//     res.status(500).json({ message: error.message });
//   }
// }

// async function atencionesPendientes(req: Request, res: Response) {
//   try {
//       const idPersona = req.user?.id;
//       if (!idPersona) return res.status(401).json({ message: "No se encontró el peluquero logueado" });

//       const peluquero = await em.findOneOrFail(Persona, { idPersona, type: 'peluquero' });
//       const atenciones = await em.find(Atencion, { peluquero, estado: 'pendiente' },
//         { populate: ['descuentos', 'servicios', 'peluquero', 'cliente', 'turnos'] });
        
//       res.status(200).json({ message: 'Atenciones pendientes encontradas', data: atenciones });
//     } catch (error: any) {
//       res.status(500).json({ message: error.message });
//   }
// }

// export {
//   crearAtencion,
//   findAll,
//   findOne,
//   contarTurnos,
//   calcularPrecioTotal,
//   atencionesPendientes
// } 
*/