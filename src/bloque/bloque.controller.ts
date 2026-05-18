/* bloque.controller.ts */
import { Request, Response } from "express";
import { orm } from "../shared/orm.js";
import { Bloque } from "./bloque.entity.js";
import { DateTime } from "luxon";
import { Persona } from "../persona/persona.entity.js";

const em = orm.em;


export async function obtenerBloquesDisponibles(req: Request, res: Response) {
  try {
    const { fecha, peluqueroId, duracionTotal } = req.query;
    if (!fecha || !peluqueroId || !duracionTotal) {
      return res.status(400).json({ error: "Faltan parámetros requeridos" });
    }

    const fechaBusqueda = new Date(`${String(fecha)}T00:00:00`);
    let bloquesDia = generarBloques(String(fecha));

    // Filtrar horarios pasados si es el día de hoy
    const ahora = DateTime.now().setZone("America/Argentina/Buenos_Aires");
    bloquesDia = bloquesDia.filter((b) => {
      const bloqueInicio = DateTime.fromISO(`${fecha}T${b.hora_inicio}`, {
        zone: "America/Argentina/Buenos_Aires",
      });
      return bloqueInicio >= ahora;
    });

    // Buscamos cualquier cosa que NO sea libre (ocupado, bloqueado, reservado)
    const ocupadosResult = await em.find(Bloque, {
      fecha: fechaBusqueda,
      peluquero: { idPersona: Number(peluqueroId) },
      estado: { $in: ["ocupado", "bloqueado"] },
    });

    const ocupadosHoras = ocupadosResult.map((o) => o.horaInicio);
    const libres = bloquesDia.filter(
      (b) => !ocupadosHoras.includes(b.hora_inicio),
    );

    const necesarios = Math.ceil(Number(duracionTotal) / 45);
    const gruposDisponibles = buscarGruposConsecutivos(libres, necesarios);

    const respuesta = gruposDisponibles.map((grupo) => ({
      hora_inicio: grupo[0].hora_inicio,
      hora_fin: grupo[grupo.length - 1].hora_fin,
    }));

    return res.json(respuesta);
  } catch (err) {
    return res.status(500).json({ error: "Error de servidor" });
  }
}

export async function obtenerEstadoAgenda(req: Request, res: Response) {
  try {
    const { fecha, peluqueroId } = req.query;
    if (!fecha || !peluqueroId)
      return res.status(400).json({ error: "Faltan parámetros" });

    const fechaBusqueda = new Date(`${String(fecha)}T00:00:00`);
    const grillaBase = generarBloques(String(fecha));

    const bloquesExistentes = await em.find(Bloque, {
      fecha: fechaBusqueda,
      peluquero: { idPersona: Number(peluqueroId) },
    });

    const agendaCompleta = grillaBase.map((bloque) => {
      const coincidencia = bloquesExistentes.find(
        (b) => b.horaInicio === bloque.hora_inicio,
      );
      return {
        ...bloque,
        estado: coincidencia ? coincidencia.estado : "libre",
      };
    });

    return res.json(agendaCompleta);
  } catch (err) {
    return res.status(500).json({ error: "Error al procesar agenda" });
  }
}

export function generarBloques(
  fecha: string,
  horaInicio = "09:00",
  horaFin = "18:00",
  duracionMin = 45,
) {
  const bloques: { hora_inicio: string; hora_fin: string }[] = [];
  let actual = DateTime.fromISO(`${fecha}T${horaInicio}`, {
    zone: "America/Argentina/Buenos_Aires",
  });
  const fin = DateTime.fromISO(`${fecha}T${horaFin}`, {
    zone: "America/Argentina/Buenos_Aires",
  });

  while (actual < fin) {
    const siguiente = actual.plus({ minutes: duracionMin });
    if (siguiente > fin) break;

    bloques.push({
      hora_inicio: actual.toFormat("HH:mm"), // Formato limpio "HH:mm"
      hora_fin: siguiente.toFormat("HH:mm"),
    });

    actual = siguiente;
  }
  return bloques;
}

export function buscarGruposConsecutivos(
  bloquesLibres: { hora_inicio: string; hora_fin: string }[],
  cantidad: number,
) {
  if (cantidad === 0) return [];
  const grupos: { hora_inicio: string; hora_fin: string }[][] = [];

  for (let i = 0; i <= bloquesLibres.length - cantidad; i++) {
    let esConsecutivo = true;
    for (let j = 1; j < cantidad; j++) {
      const prevFin = new Date(
        `1970-01-01T${bloquesLibres[i + j - 1].hora_fin}:00`,
      );
      const curInicio = new Date(
        `1970-01-01T${bloquesLibres[i + j].hora_inicio}:00`,
      );
      const diff = (curInicio.getTime() - prevFin.getTime()) / 60000;
      if (diff !== 0) {
        esConsecutivo = false;
        break;
      }
    }
    if (esConsecutivo) {
      grupos.push(bloquesLibres.slice(i, i + cantidad));
    }
  }

  return grupos;
}

export async function guardarBloqueo(req: Request, res: Response) {
  try {

    const { peluqueroId, fecha, horarios, forzar } = req.body;

    const fechaDB = new Date(`${String(fecha)}T00:00:00`);

    const horariosAProcesar = horarios || [];

    if (horariosAProcesar.length === 0) {
      return res.status(400).json({
        error: "Sin horarios seleccionados",
      });
    }

    const existentes = await em.find(Bloque, {
      fecha: fechaDB,
      peluquero: { idPersona: Number(peluqueroId) },
    });

    // VALIDAR OCUPADOS
    const conflictos = existentes.filter(
      (b) =>
        b.estado === "ocupado" &&
        horariosAProcesar.includes(b.horaInicio),
    );

    if (conflictos.length > 0 && !forzar) {
      return res.status(409).json({
        code: "CONFIRMACION_REQUERIDA",
        conflictos: conflictos.map((c) => c.horaInicio),
      });
    }

    const peluquero = await em.findOneOrFail(Persona, {
      idPersona: peluqueroId,
    });

    for (const hora of horariosAProcesar) {

      const bloqueExistente = existentes.find(
        (b) => b.horaInicio === hora,
      );

      // =========================
      // SI EXISTE
      // =========================
      if (bloqueExistente) {

        // BLOQUEADO -> LIBRE
        if (bloqueExistente.estado === "bloqueado") {
          bloqueExistente.estado = "libre";
        }

        // LIBRE -> BLOQUEADO
        else if (bloqueExistente.estado === "libre") {
          bloqueExistente.estado = "bloqueado";
        }

      }

      // =========================
      // NO EXISTE
      // =========================
      else {

        const hFin = DateTime.fromISO(`${fecha}T${hora}`)
          .plus({ minutes: 45 })
          .toFormat("HH:mm");

        em.create(Bloque, {
          fecha: fechaDB,
          horaInicio: hora,
          horaFin: hFin,
          estado: "bloqueado",
          peluquero,
        });
      }
    }

    await em.flush();

    return res.json({
      message: "Agenda actualizada correctamente",
    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      error: "Error al actualizar agenda",
    });
  }
}