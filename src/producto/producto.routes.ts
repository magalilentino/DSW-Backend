import { Router } from 'express'
import { sanitizeProductoInput, findAll, findOne, add, update, remove, listarProductos,detalleProducto, productosDeServicio } from './producto.controller.js'
import { verificarRol, verificarToken } from '../persona/persona.controller.js';

export const ProductoRouter = Router()

ProductoRouter.get('/listarProductos', listarProductos);
ProductoRouter.get('/', findAll)
ProductoRouter.get('/:idProducto', findOne)
ProductoRouter.post('/', sanitizeProductoInput, verificarToken, verificarRol(["peluquero"]), add)
ProductoRouter.put('/:idProducto', sanitizeProductoInput, verificarToken, verificarRol(["peluquero"]), update)
ProductoRouter.delete('/:idProducto', verificarToken, verificarRol(["peluquero"]), remove)
ProductoRouter.get('/detalle/:idProducto', detalleProducto);
ProductoRouter.get('/productosPorServicio/:codServicio', productosDeServicio);
