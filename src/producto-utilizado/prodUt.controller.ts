import { Request, Response, NextFunction } from 'express'
import { ProdUt } from './prodUt.entity.js'
import { orm } from '../shared/orm.js'
import { AtSer } from '../atencion-servicio/atSer.entity.js'; // Necesitamos la referencia a AtSer
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

interface RegistrarProdsUtParams {
    idAtSer: string;
}


export async function registrarProdsUt( req: Request<RegistrarProdsUtParams>, res: Response) {
    const { idAtSer } = req.params;
    if (!idAtSer) {
        return res.status(400).json({ message: "ID de Servicio-Atención (idAtSer) es requerido." });
    }  
    const idAtSerInt = parseInt(req.params.idAtSer as string, 10);
    const { prodMars, idTono } = req.body as { prodMars: ProductoPayload[], idTono?: number  }; // Array de productos seleccionados

    if (isNaN(idAtSerInt) || idAtSerInt <= 0) {
        return res.status(400).json({ message: "ID de Servicio-Atención no válido." });
    }
    // const atSer = await em.findOneOrFail(AtSer,{ idAtSer });
    // Si no hay productos, la intención es limpiar la lista (aunque la BD lo hará).
    if (!Array.isArray(prodMars)) {
        return res.status(400).json({ message: "El formato de la lista de productos es incorrecto." });
    }

    try {
        // Ejecutamos todo dentro de una transacción para garantizar atomicidad
        await em.transactional(async (tx) => {
             
            const atSerEntity = await tx.findOne(AtSer, { idAtSer: idAtSerInt }); 

            if (atSerEntity) {
                if (idTono && idTono > 0) {
                    // Si se seleccionó un tono, obtenemos su referencia
                    atSerEntity.tono = tx.getReference(Tono, idTono as any); 
                }

                // Persistir el cambio en AtSer (solo la relación y el tono, sin cambiar el estado de Atencion aquí)
                await tx.persistAndFlush(atSerEntity);
            }else{ 
                return res.status(404).json({ message: "El Servicio-Atención (AtSer) no existe." });
            }

            // 3. Limpiar registros antiguos
            // Esto garantiza que si el peluquero cambia de 3 productos a 1, los 2 anteriores se eliminen.
            // Usamos nativeDelete para mayor eficiencia en la limpieza masiva.
            await em.nativeDelete(ProdUt, { atSer: atSerEntity});

            const productosAInsertar = prodMars
          .filter(p => p.cantidad > 0)
          .map(p => {
            //const productoRef = tx.getReference(Producto, idProducto as any);
            return tx.create(ProdUt, {
              prodMar: tx.getReference(ProdMar,  p.idPM as any), //El as any le dice a TypeScript: “confía en mí, este número representa una entidad válida”.
              atSer: atSerEntity,
              cantidad: p.cantidad,
            });
          });

             // 4. Inserción Múltiple (Bulk Insert)
            if (productosAInsertar.length > 0) {
                 // MikroORM inserta automáticamente cada objeto del array como una fila distinta
                await em.persist(productosAInsertar).flush();
            }
            
            // Opcional: Si el registro de productos es el final de la ejecución, 
            // aquí se actualizaría el estado del AtSer a 'REALIZADO' o similar.
            // atSer.estado_ejecucion = 'REALIZADO'; 
            // await tx.persistAndFlush(atSer); 
    });
        return res.status(200).json({ 
            message: "datos del servicio cargados"
        });

    } catch (error: any) {
        console.error("Error al registrar datos del servicio:", error);
        return res.status(500).json({ message: "Error interno del servidor al guardar productos.", error: error.message });
    }
}