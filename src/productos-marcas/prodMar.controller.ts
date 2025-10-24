import { Request, Response, NextFunction } from 'express'
import { Producto } from '../producto/producto.entity.js'
import { orm } from '../shared/orm.js'

import { AtSer } from '../atencion-servicio/atSer.entity.js'; // Necesitamos la referencia a AtSer
import { Tono } from '../tono/tono.entity.js';
import { ProdMar } from './prodMar.entity.js';
import { Marca } from '../marca/marca.entity.js';

const em = orm.em

export function sanitizeProdUtInput(
  req: Request,
  res: Response,
  next: NextFunction
) {
  req.body.sanitizedInput = {
  producto: req.body.producto,
  marca: req.body.marca, 
  activo: true,

  }
  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key]
    }
  })
  next()
}

export async function findAll(req: Request, res: Response) {
      try {
        const prodMarcas = await em.find(ProdMar, {}, {populate: ['producto', 'marca']});
        res.status(200).json({ message: "found all productos-marcas", data: prodMarcas });
      } catch (error: any) {
        res.status(500).json({ message: error.message });
      }
}

export async function marcasPorProd(req: Request, res: Response) {
      try {
        const idProducto = Number.parseInt(req.params.idProducto)
        const producto = await em.findOneOrFail(Producto, { idProducto });
        const prodMarcas = await em.find(ProdMar, {producto, activo:true}, {populate: ['producto', 'marca']});
        res.status(200).json({ message: "found all marcas del producto", data: prodMarcas });
      } catch (error: any) {
        res.status(500).json({ message: error.message });
      }
}

export async function sincronizarProdMar(req: Request, res: Response) {
  try {
    const idProducto = Number(req.params.idProducto);
    const { prodMarcIds } = req.body as { prodMarcIds: number[] };

    if (!idProducto || !Array.isArray(prodMarcIds)) {
      return res.status(400).json({ message: "Datos inválidos" });
    }

    const producto = await em.findOne(Producto, { idProducto });
    if (!producto) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    
    const actuales = await em.find(ProdMar, { producto }, { populate: ['marca'] });

    
    const marcasActualesIds = actuales.map(pm => pm.marca.idMarca);

    
    const marcasAAgregar = prodMarcIds.filter(id => !marcasActualesIds.includes(id));

    
    const marcasAEliminar = actuales.filter(pm => !prodMarcIds.includes(pm.marca.idMarca));

    
    for (const idMarca of marcasAAgregar) {
      const marca = await em.findOne(Marca, { idMarca });
      if (marca) {
        const nuevo = new ProdMar();
        nuevo.producto = producto;
        nuevo.marca = marca;
        nuevo.activo = true;

        await em.persist(nuevo);
      }
    }

    
    for (const pm of marcasAEliminar) {
      pm.activo = false;
    }

    await em.flush();

    return res.status(200).json({ message: "ProdMar sincronizados correctamente" });
  } catch (error: any) {
    console.error("Error al sincronizar ProdMar:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
}

export async function addPorListaMarcas(req: Request, res: Response) {
    try {
        const idProducto = Number(req.params.idProducto);
        const { marcasIds } = req.body as { marcasIds: number[] };

        if (!idProducto || !Array.isArray(marcasIds)) {
        return res.status(400).json({ message: "Datos inválidos" });
        }

        const producto = await em.findOne(Producto, { idProducto });
        if (!producto) {
        return res.status(404).json({ message: "Producto no encontrado" });
        }

        for (const idMarca of marcasIds) {
        const marca = await em.findOne(Marca, { idMarca });
        if (marca) {
            const nuevo = new ProdMar();
            nuevo.producto = producto;
            nuevo.marca = marca;
            nuevo.activo = true;

            await em.persist(nuevo);
        }
        }
        await em.flush();
        return res.status(200).json({ message: "ProdMar creados correctamente" });
    } catch (error) {
         console.error("Error al crear ProdMar:", error);

        return res.status(500).json({ message: "Error interno del servidor" });
    }

}


export async function listarProductos(req: Request, res: Response) {
  try {
    const filtros: Record<string, any> = {};
    const { idMarca, idCategoria } = req.query;
    

    if (idMarca) {
      filtros.marca = idMarca ;
    }

   if (idCategoria) {
      filtros.producto = { categoria: { idCategoria: Number(idCategoria) } };
    }

    const productosMar = await em.find(
      "ProdMar",
      filtros,
      {
        populate: ['producto', 'marca', 'producto.categoria'],
        fields: ['idPM', 'producto.descripcion', 'marca.nombre'],
        }
    );

    res.json(productosMar);
  } catch (error:any) {
    console.error("Error en listarProductos:", error);
    res.status(500).json({ message: error.message });
  }
};

export async function add(req: Request, res: Response) {
  try {
    const productoUt = em.create(ProdMar, req.body.sanitizedInput)
    await em.flush()
    res.status(201).json({ message: 'producto agregado', data: productoUt })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

