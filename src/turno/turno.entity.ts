import {
  Entity,
  Property,
  PrimaryKey,
  ManyToMany,
  Cascade,
  ManyToOne,
  Rel,
} from '@mikro-orm/core'
import { Atencion } from '../atencion/atencion.entity.js'

@Entity()
export class Turno  {
  @PrimaryKey()
  idTurno?: number

  @Property({ nullable: false })
  fechaHora!: Date

  @Property({ nullable: false })
  estado!: String

  @ManyToOne(() => Atencion, {fieldName : 'atencion'})
  atencion!: Rel<Atencion> //cantidadTurno se saca con una funcion 

}