import { Request, Response, NextFunction } from 'express'
import { ServicioRepository } from './servicio.repository.js'
import { Servicio } from './servicio.entity.js'

const repository = new ServicioRepository()
//magui veni explicame esto que no lo entiendo 
//se encarga de limpiar o validar los datos de entrada relacionados con el servicio Guardarlos en una base de datos, Enviarlos a una API, O usarlos en la lógica de negocio.
function sanitizeServicioInput(req: Request, res: Response, next: NextFunction) {
  req.body.sanitizedInput = {
    name: req.body.name,
    tiempoDemora: req.body.tiempoDemora
  }

  Object.keys(req.body.sanitizedInput).forEach((key) => {
    if (req.body.sanitizedInput[key] === undefined) {
      delete req.body.sanitizedInput[key]
    }
  })
  next()
}

//Devuelve todos los servicios que hay en el repositorio. Responde con un JSON que tiene los servicios.
function findAll(req: Request, res: Response) {
  res.json({ data: repository.findAll() })
}

// La función findOne sirve para buscar un único servicio del sistema, usando el código que se pasa por la URL. Si lo encuentra, responde con un JSON que contiene los datos del servicio.
function findOne(req: Request, res: Response) {
  const codigo = req.params.codigo
  const servicio = repository.findOne({ codigo })
  if (!servicio) {
    /*return*/ res.status(404).send({ message: 'Servicio not found' })
  }
  res.json({ data: servicio })
}

//obtiene los datos sanitizados a traves del middleware sanitizeServicioInput, crea una nueva instancia de Servicio. Usa el metodo repository.add(servicioInput) para guardar el servicio y retorna un JSON con el mensaje de éxito y los datos del servicio creado.
function add(req: Request, res: Response) {
  const input = req.body.sanitizedInput
  const servicioInput = new Servicio(
    input.name,
    input.tiempoDemora
    )
  const servicio = repository.add(servicioInput)
  /*return*/ res.status(201).send({ message: 'Servicio created', data: servicio })
}


// La función update busca un servicio en el repositorio usando el código que se pasa por la URL. Si lo encuentra, actualiza los datos del servicio, da un mensaje de exito y muestra los cambios. Si no lo encuentra, responde con un mensaje de error.
function update(req: Request, res: Response) {
  req.body.sanitizedInput.codigo = req.params.codigo
  const servicio = repository.update(req.body.sanitizedInput)

  if (!servicio) {
    /*return*/ res.status(404).send({ message: 'Servicio not found' })
  }
  /*return*/ res.status(200).send({ message: 'Servicio updated successfully', data: servicio })
}


function remove(req: Request, res: Response) {
  const codigo = req.params.codigo
  const servicio = repository.delete({ codigo })

  if (!servicio) {
    res.status(404).send({ message: 'Servicio not found' })
  } else {
    res.status(200).send({ message: 'Servicio deleted successfully' })
  }
}

export { sanitizeServicioInput, findAll, findOne, add, update, remove }

// si algo se rompe, es porque le cambie el nombre por controller
// los return estan comentados porque si no, no funca. tendrian que ir ya que el return es para que no siga ejecutando el resto de la funcion 