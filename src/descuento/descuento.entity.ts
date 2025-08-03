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
export class Descuento {
  @PrimaryKey()
  idDescuento!: number

  @Property({ nullable: false })
  porcentaje!: number
}