import { Request, Response, NextFunction } from 'express'
import { Producto } from './producto.entity.js'
import { orm } from '../shared/orm.js'
import { ProdUt } from '../producto-utilizado/prodUt.entity.js'
import { Formula } from '@mikro-orm/core'

const em = orm.em

function sanitizeProductoInput(
  req: Request,
  res: Response,
  next: NextFunction
) {
  req.body.sanitizedInput = {
  descripcion: req.body.descripcio,
  categoria: req.body.categoria, 
  activo: true,

  }
  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key]
    }
  })
  next()
}

async function findAll(req: Request, res: Response) {
  try {
    const productos = await em.find(
      Producto,
      {},
      { populate: ['categoria', 'productosMarcas'] }
    )
    res.status(200).json({ message: 'found all producto', data: productos })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function findAllActivos(req: Request, res: Response) {
  try {
    const productos = await em.find(
      Producto,
      {activo :true},
      { populate: ['categoria', 'productosMarcas'] }
    )
    res.status(200).json({ message: 'found all producto', data: productos })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function productosDeServicio(req: Request, res: Response) {
  try {
    const servicio = req.servicio;

    const productos = await em.find(
      Producto,
      {
       // servicios: servicio,
      },
      {
        populate: ['categoria', 'productosMarcas']
      }
    );

    res.status(200).json({ message: "productos del servicio seleccionado", data: productos });
  } catch (error: any) {
    res.status(500).json({ message: "no se encontraron productos para el servicio seleccionado" });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const idProducto = Number.parseInt(req.params.idProducto)
    const producto = await em.findOneOrFail(
      Producto,
      { idProducto },
      { populate: ['categoria', 'productosMarcas'] }
    )
    res.status(200).json({ message: 'found producto', data: producto })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function add(req: Request, res: Response) {
  try {
    const producto = em.create(Producto, req.body.sanitizedInput)
    await em.flush()
    res.status(201).json({ message: 'producto created', data: producto })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function update(req: Request, res: Response) {
  try {
    const idProducto = Number.parseInt(req.params.idProducto)
    const productoToUpdate = await em.findOneOrFail(Producto, { idProducto })
    em.assign(productoToUpdate, req.body.sanitizedInput)
    await em.flush()
    res
      .status(200)
      .json({ message: 'producto updated', data: productoToUpdate })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function remove(req: Request, res: Response) {
  try {
    const idProducto = Number.parseInt(req.params.idProducto)
    const producto = await em.findOneOrFail(Producto, { idProducto }, {populate: [ 'productosMarcas']})
    const idProdMarcas = producto.productosMarcas.getIdentifiers('idPM'); 
//caso de que no tenga productos marcas asociados 
    if (idProdMarcas.length === 0) {
      producto.activo = false;
      await em.flush();
      return res.status(200).json({ message: `Producto ${idProducto} eliminado correctamente` });
    }

    const usos = await em.count(Formula, { prodMar: { $in: idProdMarcas }, activo: true }); //cuento la cantidad de usos 

    if (usos > 0) {
      return res.status(400).json({
        message: `No se puede eliminar el producto. Está siendo utilizado en ${usos} fórmulas de tonos.`, 
      });
    }
//caso de que no tenga formulas asociadas 
    producto.activo = false;
    await em.flush();
    return res.status(200).json({ message: `Producto ${idProducto} eliminado correctamente` });
  }catch (error: any) {
    console.error("Error al eliminar producto:", error);
    res.status(500).json({ message: error.message })
  }
}

//lista de productos filtrados por categoria y marca 
export async function listarProductos(req: Request, res: Response) {
  try {
    const filtros: Record<string, any> = {};
    const { idMarca, idCategoria } = req.query;
    // const marcaId = idMarca ? Number(idMarca) : undefined;

    if (idMarca) {
      filtros.productosMarcas = { idMarca: idMarca };
    }

    if (idCategoria) {
      filtros.categoria = idCategoria; 
    }

    const productos = await em.find(
      "Producto",
      filtros,
      {
        fields: ["idProducto", "descripcion"], 
      }
    );

    res.json(productos);
  } catch (error:any) {
    console.error("Error en listarProductos:", error);
    res.status(500).json({ message: error.message });
  }
};

export const detalleProducto = async (req: Request, res: Response) => {
  try {
    const  idProducto  = Number.parseInt(req.params.idProducto);

    const producto = await em.findOne(Producto, { idProducto },  { populate: [ "categoria"] } );

    if (!producto) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.json(producto);
  } catch (error:any) {
    res.status(500).json({ message: error.message });
  }
};
export { sanitizeProductoInput, findAll, findOne, add, update, remove, productosDeServicio }
