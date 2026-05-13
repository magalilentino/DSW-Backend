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
    )
    res.status(200).json({ message: 'Se encontraron todas las Categorias', data: categorias })
  } catch (error: any) {
    res.status(500).json({ message: "No se encontró ninguna Categoria" })
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const idCategoria = Number.parseInt(req.params.idCategoria as string)
    const categoria = await em.findOneOrFail(
      Categoria,
      { idCategoria }
    )
    res.status(200).json({ message: 'Categoria encontrada', data: categoria })
  } catch (error: any) {
    res.status(500).json({ message: 'No se encontró ninguna categoria' })
  }
}

async function add(req: Request, res: Response) {
  try {
    const categoria = em.create(Categoria, req.body.sanitizedInput)
    await em.flush()
    res.status(201).json({ message: 'Categoria creada correctamente', data: categoria })
  } catch (error: any) {
    res.status(500).json({ message: 'No se pudo crear la categoria' })
  }
}

async function update(req: Request, res: Response) {
  try {
    const idCategoria = Number.parseInt(req.params.idCategoria as string)
    const categoriaToUpdate = await em.findOneOrFail(Categoria, { idCategoria })
    em.assign(categoriaToUpdate, req.body.sanitizedInput)
    await em.flush()
    res
      .status(200)
      .json({ message: 'Categoria actualizada correctamente', data: categoriaToUpdate })
  } catch (error: any) {
    res.status(500).json({ message: 'No se pudo actualizar la categoria' })
  }
}


async function remove(req: Request, res: Response) {
  try {
    const idCategoria = Number.parseInt(req.params.idCategoria as string);

    const categoria = await em.findOne(Categoria, { idCategoria });
    if (!categoria) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }

    
    const categoriaRef = em.getReference(Categoria, idCategoria as unknown as Categoria);

    const productosActivos = await em.find(Producto, {
      categoria: categoriaRef,
    });

    if (productosActivos.length > 0) {
      return res.status(409).json({
        message: "No se puede eliminar la categoría porque tiene productos relacionados.",
      });
    }

    await em.removeAndFlush(categoriaRef);
    return res.status(200).json({ message: "Categoría eliminada correctamente" });

  } catch (error: any) {
    res.status(500).json({ message: 'No se pudo eliminar la categoria' });
  }
}



export { sanitizeCategoriaInput, findAll, findOne, add, update, remove}
