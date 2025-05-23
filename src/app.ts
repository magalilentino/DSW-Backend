import express from 'express'
import { ServicioRouter } from './servicio/servicio.routes.js'

const app = express()
app.use(express.json())

app.use('/api/servicio', ServicioRouter)

app.use(( _, res) => {
    res.status(404).send({ message: 'Resource not found' })
})

app.listen(3000, () => {
  console.log('Server runnning on http://localhost:3000/')
})