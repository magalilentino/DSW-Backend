import express from 'express'
import cors from 'cors'
import 'reflect-metadata'
import { orm, syncSchema } from './shared/orm.js'
import { RequestContext } from '@mikro-orm/core'

import { ServicioRouter } from './servicio/servicio.routes.js'
import { MarcaRouter } from './marca/marca.routes.js'
import { CategoriaRouter } from './categoria/categoria.routes.js'
import { DescuentoRouter } from './descuento/descuento.routes.js'
import { PagoRouter } from './pago/pago.routes.js'
import { ProductoRouter } from './producto/producto.routes.js'
import { ClienteRouter } from './persona/cliente/cliente.routes.js'
import { PeluqueroRouter } from './persona/peluquero/peluquero.routes.js'
import { TonoRouter } from './tono/tono.routes.js'
import { TurnoRouter } from './turno/turno.routes.js'
import { FormulaRouter } from './formula/formula.routes.js'
import { AtencionRouter } from './atencion/atencion.routes.js'
import { PersonaRouter } from './persona/persona.routes.js'

const app = express();

app.use(cors({ origin: 'http://localhost:5173' })); // React corre en 5173
app.use(express.json());

app.use((req, res, next) => {
  RequestContext.create(orm.em, next)
})

//app.use('/api/precio/servicio', ServicioRouter)
app.use('/api/servicio', ServicioRouter)
app.use('/api/marca', MarcaRouter)
app.use('/api/cliente', ClienteRouter)
app.use('/api/peluquero', PeluqueroRouter)
app.use('/api/persona', PersonaRouter)
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

app.listen(3000, () => {
  console.log('Server corriendo en http://localhost:3000');
});

await syncSchema()




