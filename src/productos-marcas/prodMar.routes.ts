import { Router } from 'express'
import { findAll, listarProductos, marcasPorProd, sincronizarProdMar, addPorListaMarcas} from './prodMar.controller.js'

export const ProdMarRouter = Router()

ProdMarRouter.get('/', findAll)
ProdMarRouter.get('/listarProductos', listarProductos);
ProdMarRouter.get('/marcasPorProd/:idProducto', marcasPorProd);
ProdMarRouter.put('/sincronizarProdMar/:idProducto', sincronizarProdMar);
ProdMarRouter.post('/:idProducto', addPorListaMarcas);


