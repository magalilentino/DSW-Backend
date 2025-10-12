import { Request, Response, NextFunction } from 'express'
import { Producto } from './producto.entity.js'
import { orm } from '../shared/orm.js'
import { Servicio } from '../servicio/servicio.entity.js'

const em = orm.em

function sanitizeProductoInput(
  req: Request,
  res: Response,
  next: NextFunction
) {
  req.body.sanitizedInput = {
  descripcion: req.body.descripcion,
  // formulas: req.body.formulas, 
  // servicios: req.body.servicios,
  marcas: req.body.marcas,
  categoria: req.body.categoria, 

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
      { populate: ['categoria', 'marcas'] }
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
        populate: ['categoria', 'marcas', 'formulas']
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
      { populate: ['categoria', 'marcas'] }
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
    const producto = await em.findOneOrFail(Producto, { idProducto })
    await em.removeAndFlush(producto)
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}



// lista de productos filtrados por categoria y marca
export async function listarProductos(req: Request, res: Response) {
    try {
        // 1. Obtener y convertir los query params de String a Number
        const { idMarca, idCategoria } = req.query;

        // Convertir a Number. Si no existe o no es un número válido, será undefined.
        const marcaId = idMarca ? Number(idMarca) : undefined;
        const categoriaId = idCategoria ? Number(idCategoria) : undefined;

        // 2. Construir el objeto de filtros (where) de Micro-ORM
        const filtros: any = {};

        // Agregar filtro de marca solo si es un número válido
        if (marcaId && !isNaN(marcaId)) {
            filtros.marcas = { id: marcaId }; 
        }

        // Agregar filtro de categoría solo si es un número válido
        if (categoriaId && !isNaN(categoriaId)) {
            filtros.categoria = categoriaId;
        }
        
        // 3. Ejecutar la búsqueda con filtros y populate (para asegurar la carga)
        const productos = await em.find(
            "Producto", // Puedes usar la clase Producto importada o el string "Producto"
            filtros,    // Objeto de filtros. Si está vacío, trae todos.
            {
                // Incluir populate es una buena práctica para evitar errores de serialización.
                // Reemplaza 'marca' y 'categoria' con los nombres de las propiedades de relación en tu Producto.entity.ts
                populate: ['marca', 'categoria'], 
                
                // Si quieres traer solo ciertos campos (si tu entidad tiene muchos):
                fields: ["idProducto", "descripcion", "categoria.nombreCategoria"], 
            }
        );

        // 4. Devolver la respuesta
        res.status(200).json(productos);

    } catch (error: any) {
        console.error("Error al listar productos con filtros:", error);
        // Devuelve el mensaje de error para ayudar en el diagnóstico del frontend
        res.status(500).json({ message: error.message || "Error al conectar con la base de datos." });
    }
}


export const detalleProducto = async (req: Request, res: Response) => {
  try {
    const  idProducto  = Number.parseInt(req.params.idProducto);

    const producto = await em.findOne(Producto, { idProducto },  { populate: ["marcas", "categoria"] } );

    if (!producto) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.json(producto);
  } catch (error:any) {
    res.status(500).json({ message: error.message });
  }
};
export { sanitizeProductoInput, findAll, findOne, add, update, remove, productosDeServicio }
