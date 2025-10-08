import { Persona } from "../persona/persona.entity";
import { Request } from 'express';

// interface JwtPayload {
//     idPersona: number; // O number, o el tipo de tu ID de peluquero
//     type: string;// O rol, si lo estás incluyendo
//     nombre: String;
// }

// declare module 'express-serve-static-core' {
//     interface Request {
//         user?: JwtPayload; // Ahora TypeScript sabe que req.user tiene id y type
//     }
// }

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        type: string;
        nombre: string;
      };
    }
  }
}

declare global {
  namespace Express {
    interface Request {
      servicio?: Servicio; 
    }
  }
}