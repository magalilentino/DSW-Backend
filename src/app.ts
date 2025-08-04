import express from 'express'
import 'reflect-metadata'
import { orm, syncSchema } from './shared/orm.js'
import { RequestContext } from '@mikro-orm/core'

import { ServicioRouter } from './servicio/servicio.routes.js'
import { PrecioRouter } from './precio/precio.routes.js'
import { MarcaRouter } from './marca/marca.routes.js'
import { CategoriaRouter } from './categoria/categoria.routes.js'
import { DescuentoRouter } from './descuento/descuento.routes.js'
import { PagoRouter } from './pago/pago.routes.js'
import { ProductoRouter } from './producto/producto.routes.js'
import { ClienteRouter } from './persona/cliente.routes.js'
import { PeluqueroRouter } from './persona/peluquero.routes.js'
import { TonoRouter } from './tono/tono.routes.js'
import { TurnoRouter } from './turno/turno.routes.js'
import { FormulaRouter } from './formula/formula.routes.js'
import { AtencionRouter } from './atencion/atencion.routes.js'


const app = express()
app.use(express.json())

//luego de los middlewares base
app.use((req, res, next) => {
  RequestContext.create(orm.em, next)
})

app.use('/api/precio/servicio', ServicioRouter)
app.use('/api/precio', PrecioRouter)
app.use('/api/marca', MarcaRouter)
app.use('/api/cliente', ClienteRouter)
app.use('/api/peluquero', PeluqueroRouter)
app.use('/api/categoria', CategoriaRouter)
app.use('/api/descuento', DescuentoRouter)
app.use('/api/pago', PagoRouter)
app.use('/api/producto', ProductoRouter)
app.use('/api/tono', TonoRouter)
app.use('/api/turno', TurnoRouter)
app.use('/api/formula', FormulaRouter)
app.use('/api/atencion', AtencionRouter)



app.use((_, res) => {
  res.status(404).send({ message: 'Resource not found' })
})

await syncSchema()

app.listen(3000, () => {
  console.log('Server runnning on http://localhost:3000/')
})



