import {
  Entity,
  Property,
  PrimaryKey,
  ManyToOne,
  Rel,
} from '@mikro-orm/core'
import { Atencion } from '../atencion/atencion.entity.js'
import { Bloque } from '../bloque/bloque.entity.js'

@Entity()
export class Turno  {
  @PrimaryKey()
  idTurno?: number

  @Property({ nullable: false })
    estado!: "pendiente" | "finalizado" | "cancelado" | "disponible"

  @ManyToOne(() => Atencion, {fieldName : 'atencion'})
    atencion!: Rel<Atencion>

  @ManyToOne(() => Bloque, {fieldName : 'bloque'})
    bloque!: Rel<Bloque> 
}
