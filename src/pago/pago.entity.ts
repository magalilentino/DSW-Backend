import {
  Entity,
  Property,
  ManyToMany,
  Cascade,
  ManyToOne,
  Rel,
  PrimaryKey,
} from '@mikro-orm/core'

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
}

