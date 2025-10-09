import { Request, Response } from "express";
import { orm } from "../shared/orm.js";
import { Bloque } from "./bloque.entity.js";

const em = orm.em;

export async function obtenerBloquesDisponibles(req: Request, res: Response) {
  try {
    const { fecha, peluqueroId, duracionTotal } = req.query;
    if (!fecha || !peluqueroId || !duracionTotal) {
      return res.status(400).json({ error: "fecha, peluqueroId y duracionTotal son requeridos" });
    }

    const bloquesDia = generarBloques(String(fecha));

    const ocupadosResult = await em.find(Bloque, {
      fecha: new Date(String(fecha)),
      peluquero: { idPersona: Number(peluqueroId) },
      estado: "ocupado"
    });

    const ocupados = ocupadosResult.map(o => o.horaInicio);
    const libres = bloquesDia.filter(b => !ocupados.includes(b.hora_inicio));

    const necesarios = Math.ceil(Number(duracionTotal) / 45);
    const gruposDisponibles = buscarGruposConsecutivos(libres, necesarios);

    const respuesta = gruposDisponibles.map(grupo => ({
      hora_inicio: grupo[0].hora_inicio,
      hora_fin: grupo[grupo.length - 1].hora_fin
    }));

    return res.json(respuesta);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error al obtener disponibilidad" });
  }
}

export async function obtenerBloquesDia(req: Request, res: Response) {
  try {
    const { fecha, peluqueroId } = req.query;
    if (!fecha || !peluqueroId) {
      return res.status(400).json({ error: "fecha y peluqueroId son requeridos" });
    }

    const bloquesDia = generarBloques(String(fecha));

    const ocupadosResult = await em.find(Bloque, {
      fecha: new Date(String(fecha)),
      peluquero: { idPersona: Number(peluqueroId) },
      estado: "ocupado"
    });

    const ocupados = new Set(ocupadosResult.map(o => o.horaInicio));

    const respuesta = bloquesDia.map(b => ({
      hora_inicio: b.hora_inicio,
      hora_fin: b.hora_fin,
      estado: ocupados.has(b.hora_inicio) ? "ocupado" : "libre"
    }));

    return res.json(respuesta);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error al obtener bloques del día" });
  }
}

export function generarBloques(fecha: string, horaInicio = "09:00", horaFin = "18:00", duracionMin = 45) {
  const bloques: { hora_inicio: string; hora_fin: string }[] = [];
  let actual = new Date(`${fecha}T${horaInicio}:00`);
  const fin = new Date(`${fecha}T${horaFin}:00`);

  while (actual < fin) {
    const siguiente = new Date(actual.getTime() + duracionMin * 60000);
    if (siguiente > fin) break;

    bloques.push({
      hora_inicio: actual.toTimeString().slice(0, 5),
      hora_fin: siguiente.toTimeString().slice(0, 5)
    });

    actual = siguiente;
  }

  return bloques;
}

export function buscarGruposConsecutivos(
  bloquesLibres: { hora_inicio: string; hora_fin: string }[],
  cantidad: number
) {
  if (cantidad === 0) return [];
  const grupos: { hora_inicio: string; hora_fin: string }[][] = [];

  for (let i = 0; i <= bloquesLibres.length - cantidad; i++) {
    const grupo = bloquesLibres.slice(i, i + cantidad);
    let esConsecutivo = true;

    for (let j = 1; j < grupo.length; j++) {
      const prev = new Date(`1970-01-01T${grupo[j - 1].hora_fin}:00`);
      const cur = new Date(`1970-01-01T${grupo[j].hora_inicio}:00`);
      if (cur.getTime() - prev.getTime() !== 45 * 60000) {
        esConsecutivo = false;
        break;
      }
    }

    if (esConsecutivo) grupos.push(grupo);
  }

  return grupos;
}
