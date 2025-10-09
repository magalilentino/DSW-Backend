import { Request, Response, NextFunction } from 'express';

export function sanitizeAtencionInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    estado: "pendiente",
    servicios: req.body.servicios,
    cliente: req.body.cliente,
    descuentos: req.body.descuentos,
    peluquero: req.body.peluquero,
    fechaInicio: req.body.fechaInicio
  };

  Object.keys(req.body.sanitizedInput).forEach(key => {
    if (req.body.sanitizedInput[key] === undefined) delete req.body.sanitizedInput[key];
  });

  next();
}