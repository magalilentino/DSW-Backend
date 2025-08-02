import { Repository } from '../shared/repository.js'
import { Servicio } from './servicio.entity.js'
import { pool } from '../shared/MySQL/connection.mysql.js'

export class ServicioRepository implements Repository<Servicio> {
  public async findAll(): Promise<Servicio[] | undefined> {
    const [servicios] = await pool.query('SELECT * FROM servicios')
    return servicios as Servicio[]
  }

  public async findOne(item: { codigo: string }): Promise<Servicio[] | undefined> {
    const codigo = Number.parseInt(item.codigo)
    const [servicios] = await pool.query('SELECT * FROM servicios WHERE codigo = ?', [codigo])
    if ((servicios as Servicio[]).length=== 0) {
      return undefined
    }
    else {
      return (servicios as Servicio[])[0]
    }
  }// ver

  public async add(item: Servicio): Promise<Servicio | undefined> {
    throw new Error ('not implemented')
  }

  public async update(id: string, item: Servicio): Promise<Servicio | undefined> {
    throw new Error ('not implemented')
  }

  public async delete(item: { codigo: string }): Promise<Servicio | undefined> {
    throw new Error ('not implemented')
  }
}
