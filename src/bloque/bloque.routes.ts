import { Router } from "express";
import {
  obtenerBloquesDisponibles,
  guardarBloqueo,
  obtenerEstadoAgenda,
} from "./bloque.controller.js";
import { verificarRol, verificarToken } from "../persona/persona.controller.js";

export const BloqueRouter = Router();

BloqueRouter.get("/disponibles", obtenerBloquesDisponibles);
BloqueRouter.get("/estado-agenda", verificarToken, verificarRol(["peluquero"]), obtenerEstadoAgenda);
BloqueRouter.post("/bloqueodia", verificarToken, verificarRol(["peluquero"]), guardarBloqueo);
