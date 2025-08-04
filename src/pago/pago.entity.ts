import {
  Entity,
  Property,
  ManyToMany,
  Cascade,
  ManyToOne,
  Rel,
  PrimaryKey,
} from '@mikro-orm/core'
import { Atencion } from '../atencion/atencion.entity.js'

@Entity()
export class Pago {
  @PrimaryKey()
  nroPago!: number

  @Property({ nullable: false })
  metodo!: string

  @Property({ nullable: false }) //el total lo derivamos en consultas o lo guardamos en la base de datos
  total!: number

  @Property({ nullable: false })
  estado!: string

  @ManyToOne(() => Atencion, {fieldName : 'atencion'})
  atencion!: Rel<Atencion>
}

