import { Request, Response, NextFunction } from 'express'
import { ProdUt } from './prodUt.entity.js'
import { orm } from '../shared/orm.js'
import { AtSer } from '../atencion-servicio/atSer.entity.js'; 
import { Tono } from '../tono/tono.entity.js';
import { ProdMar } from '../productos-marcas/prodMar.entity.js';

const em = orm.em

export function sanitizeProdUtInput(
  req: Request,
  res: Response,
  next: NextFunction
) {
  req.body.sanitizedInput = {
  cantidad: req.body.cantidad,
  prodMar: req.body.prodMar,
  atSer: req.body.atSer, 

  }
  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key]
    }
  })
  next()
}


export async function add(req: Request, res: Response) {
  try {
    const productoUt = em.create(ProdUt, req.body.sanitizedInput)
    await em.flush()
    res.status(201).json({ message: 'producto agregado', data: productoUt })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

// Interfaz para la data que viene del frontend
interface ProductoPayload {
    idPM: number;
    cantidad: number;
}

export async function registrarProdsUt( req: Request, res: Response) {
    const { idAtSer } = req.params;
    if (!idAtSer) {
        return res.status(400).json({ message: "ID de Servicio-Atención (idAtSer) es requerido." });
    }  
    const idAtSerInt = parseInt(req.params.idAtSer as string, 10);
   
    const { prodMars, idTono } = req.body as { prodMars: ProductoPayload[], idTono?: number  };

    if (isNaN(idAtSerInt) || idAtSerInt <= 0) {
        return res.status(400).json({ message: "ID de Servicio-Atención no válido." });
    }

    if (!Array.isArray(prodMars)) {
        return res.status(400).json({ message: "El formato de la lista de productos es incorrecto." });
    }

    try {
        await em.transactional(async (tx) => {
             
          const atSerEntity = await tx.findOne(AtSer, { idAtSer: idAtSerInt }); 

          if (atSerEntity) {
              if (idTono && idTono > 0) {
                  atSerEntity.tono = tx.getReference(Tono, idTono as any); 
              }else {
                  atSerEntity.tono = null; 
              }

              await tx.persistAndFlush(atSerEntity);
          }else{ 
              return res.status(404).json({ message: "El Servicio-Atención (AtSer) no existe." });
          }

          await em.nativeDelete(ProdUt, { atSer: atSerEntity});

          const productosAInsertar = prodMars
          .filter(p => p.cantidad > 0)
          .map(p => {
            return tx.create(ProdUt, {
              prodMar: tx.getReference(ProdMar,  p.idPM as any), 
              atSer: atSerEntity,
              cantidad: p.cantidad,
            });
          });

          if (productosAInsertar.length > 0) {
              await em.persist(productosAInsertar).flush();
          }
            
    });
        return res.status(200).json({ 
            message: "datos del servicio cargados"
        });

    } catch (error: any) {
        console.error("Error al registrar datos del servicio:", error);
        return res.status(500).json({ message: "Error interno del servidor al guardar productos.", error: error.message });
    }
}