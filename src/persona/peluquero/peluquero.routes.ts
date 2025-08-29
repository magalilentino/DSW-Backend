import { Router } from "express";
import { findAllPeluquero } from "./peluquero.controller.js";

export const PeluqueroRouter = Router();

PeluqueroRouter.get("/findAllPeluquero", findAllPeluquero);
