import { Request, Response, NextFunction } from 'express'
import { Categoria } from './categoria.entity.js'
import { orm } from '../shared/orm.js'
import { Producto } from '../producto/producto.entity.js'

const em = orm.em

function sanitizeCategoriaInput(
  req: Request,
  res: Response,
  next: NextFunction
) {
  req.body.sanitizedInput = {
    nombreCategoria: req.body.nombreCategoria,
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
    const categorias = await em.find(
      Categoria,
      {}
      //{ populate: ['tonos', 'productos', 'precios', 'clientes'] }
    )
    res.status(200).json({ message: 'found all categoria', data: categorias })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const idCategoria = Number.parseInt(req.params.idCategoria)
    const categoria = await em.findOneOrFail(
      Categoria,
      { idCategoria }
      //{ populate: ['tonos', 'productos', 'precios', 'clientes'] }
    )
    res.status(200).json({ message: 'found categoria', data: categoria })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function add(req: Request, res: Response) {
  try {
    const categoria = em.create(Categoria, req.body.sanitizedInput)
    await em.flush()
    res.status(201).json({ message: 'categoria created', data: categoria })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function update(req: Request, res: Response) {
  try {
    const idCategoria = Number.parseInt(req.params.idCategoria)
    const categoriaToUpdate = await em.findOneOrFail(Categoria, { idCategoria })
    em.assign(categoriaToUpdate, req.body.sanitizedInput)
    await em.flush()
    res
      .status(200)
      .json({ message: 'categoria updated', data: categoriaToUpdate })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}


async function remove(req: Request, res: Response) {
  try {
    const idCategoria = Number(req.params.idCategoria);

    const categoria = await em.findOne(Categoria, { idCategoria });
    if (!categoria) {
      return res.status(404).json({ mensaje: "Categoría no encontrada" });
    }

    
    const categoriaRef = em.getReference(Categoria, idCategoria as unknown as Categoria);

    const productosActivos = await em.find(Producto, {
      categoria: categoriaRef,
    });

    if (productosActivos.length > 0) {
      return res.status(409).json({
        mensaje: "No se puede eliminar la categoría porque tiene productos relacionados.",
      });
    }

    await em.removeAndFlush(categoriaRef);
    return res.status(200).json({ mensaje: "Categoría eliminada correctamente" });

  } catch (error: any) {
    res.status(500).json({ mensaje: error.message });
  }
}



export { sanitizeCategoriaInput, findAll, findOne, add, update, remove}
