import { Request, Response, NextFunction } from 'express'
import { ProdUt } from './prodUt.entity.js'
import { Producto } from '../producto/producto.entity.js'
import { orm } from '../shared/orm.js'

import { AtSer } from '../atencion-servicio/atSer.entity.js'; // Necesitamos la referencia a AtSer

const em = orm.em

export function sanitizeProdUtInput(
  req: Request,
  res: Response,
  next: NextFunction
) {
  req.body.sanitizedInput = {
  cantidad: req.body.cantidad,
  producto: req.body.producto,
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
    idProducto: number;
    cantidad: number;
}

interface RegistrarProdsUtParams {
    idAtSer: string;
}


export async function registrarProdsUt( req: Request<RegistrarProdsUtParams>, res: Response) {

     // Desestructurar de forma segura
    const { idAtSer } = req.params;
    
    // Asegurarse de que no sea undefined (aunque no debería serlo si la ruta coincide)
    if (!idAtSer) {
        return res.status(400).json({ message: "ID de Servicio-Atención (idAtSer) es requerido." });
    }  
  
  // 1. Obtener IDs y Data
    const idAtSerInt = parseInt(req.params.idAtSer as string, 10);
    //const idAtSer = Number(req.params.idAtSer);
    const { productos } = req.body as { productos: ProductoPayload[] }; // Array de productos seleccionados

    if (isNaN(idAtSerInt) || idAtSerInt <= 0) {
        return res.status(400).json({ message: "ID de Servicio-Atención no válido." });
    }
    // const atSer = await em.findOneOrFail(AtSer,{ idAtSer });
    // Si no hay productos, la intención es limpiar la lista (aunque la BD lo hará).
    if (!Array.isArray(productos)) {
        return res.status(400).json({ message: "El formato de la lista de productos es incorrecto." });
    }

    try {
        // Ejecutamos todo dentro de una transacción para garantizar atomicidad
        await em.transactional(async (tx) => {
            
            // 2. Verificar que el AtSer exista
            // const atSer = await em.findOne(AtSer, { idAtSer });
            // const atSerRef = tx.getReference(AtSer, idAtSer); 
            const atSerEntity = await tx.findOne(AtSer, { idAtSer: idAtSerInt }); 

            if (!atSerEntity) {
                // Este error puede indicar que la URL es incorrecta o la atención fue eliminada
                return res.status(404).json({ message: "El Servicio-Atención (AtSer) no existe." });
            }

            // 3. Limpiar registros antiguos
            // Esto garantiza que si el peluquero cambia de 3 productos a 1, los 2 anteriores se eliminen.
            // Usamos nativeDelete para mayor eficiencia en la limpieza masiva.
            await em.nativeDelete(ProdUt, { atSer: atSerEntity});

            const productosAInsertar = productos
          .filter(p => p.cantidad > 0)
          .map(p => {
            //const productoRef = tx.getReference(Producto, idProducto as any);
            return tx.create(ProdUt, {
              producto: tx.getReference(Producto,  p.idProducto as any), //El as any le dice a TypeScript: “confía en mí, este número representa una entidad válida”.
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
            message: "Productos utilizados registrados y actualizados exitosamente."
        });

    } catch (error: any) {
        console.error("Error al registrar productos utilizados:", error);
        return res.status(500).json({ message: "Error interno del servidor al guardar productos.", error: error.message });
    }
}