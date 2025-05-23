import { Repository } from '../shared/repository.js'
import { Servicio } from './servicio.entity.js'

/*const servicios = [
  new Servicio(
    'Lavado',                         esto vendria aser un ejemplo
    40, //ejemplo                 
    "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  ),
]*/

const servicios: Servicio[] = []

export class ServicioRepository implements Repository<Servicio> {
  public findAll(): Servicio[] | undefined {
    return servicios // devuelve todos los servicios
  }

  public findOne(item: { codigo: string }): Servicio | undefined {
    return servicios.find((servicio) => servicio.codigo === item.codigo)
  } // devuelve un servicio en particular

  public add(item: Servicio): Servicio | undefined {
    servicios.push(item)
    return item
  } // agrega un servicio al array de servicios y devuelve el servicio agregado

  public update(item: Servicio): Servicio | undefined {
    const servicioIdx = servicios.findIndex((servicio) => servicio.codigo === item.codigo)

    if (servicioIdx !== -1) {
      servicios[servicioIdx] = { ...servicios[servicioIdx], ...item }
    }
    return servicios[servicioIdx]
  } //hace una busqueda a traves del array buscando la coincidencia del codigo, si lo encuentra 
  // servicioIdx retorna el valor dentro del array y despues retorna el servicio, si no lo encuentra retorna -1

  public delete(item: { codigo: string }): Servicio | undefined {
    const servicioIdx = servicios.findIndex((servicio) => servicio.codigo === item.codigo)

    if (servicioIdx !== -1) {
      const deletedServicio = servicios[servicioIdx]
      servicios.splice(servicioIdx, 1) //El método splice() en JavaScript se usa para agregar, quitar o reemplazar elementos de un array. 
                                      // El 1 indica que se eliminará un solo elemento a partir del índice encontrado.
                                      //si fuera 3 se eliminarían 3 elementos a partir del índice encontrado.    
      return deletedServicio
    }
  }//hace una busqueda a traves del array buscando la coincidencia del codigo, si lo encuentra. servicioIdx retorna el valor dentro del array.
}


//tendriamos que llamarlo item o con otro nombre?
