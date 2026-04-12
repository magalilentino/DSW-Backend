import { Router } from "express";
import {
  obtenerBloquesDisponibles,
  guardarBloqueo,
  obtenerEstadoAgenda,
} from "./bloque.controller.js";

export const BloqueRouter = Router();

BloqueRouter.get("/disponibles", obtenerBloquesDisponibles);
BloqueRouter.get("/estado-agenda", obtenerEstadoAgenda);
BloqueRouter.post("/bloqueodia", guardarBloqueo);
