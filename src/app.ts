import express from 'express'
import { ServicioRouter } from './servicio/servicio.routes.js'
import { MarcaRouter } from './marca/marca.routes.js'
import 'reflect-metadata'
import { orm, syncSchema } from './shared/orm.js'
import { RequestContext } from '@mikro-orm/core'

const app = express()
app.use(express.json())

//luego de los middlewares base
app.use((req, res, next) => {
  RequestContext.create(orm.em, next)
})

app.use('/api/servicio', ServicioRouter)
app.use('/api/marca', MarcaRouter)

app.use((_, res) => {
  res.status(404).send({ message: 'Resource not found' })
})


await syncSchema()

app.listen(3000, () => {
  console.log('Server runnning on http://localhost:3000/')
})



