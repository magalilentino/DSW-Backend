import { Router } from 'express'
import { findAll, listarProductos, marcasPorProd, sincronizarProdMar, addPorListaMarcas} from './prodMar.controller.js'
import { verificarRol, verificarToken } from '../persona/persona.controller.js';

export const ProdMarRouter = Router()

ProdMarRouter.get('/', findAll)
ProdMarRouter.get('/listarProductos', listarProductos);
ProdMarRouter.get('/marcasPorProd/:idProducto', marcasPorProd);
ProdMarRouter.put('/sincronizarProdMar/:idProducto', verificarToken, verificarRol(["peluquero"]), sincronizarProdMar);
ProdMarRouter.post('/:idProducto', verificarToken, verificarRol(["peluquero"]), addPorListaMarcas);


