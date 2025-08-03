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
export class Producto {
  @PrimaryKey()
  idProducto!: number

  @Property({ nullable: false })
  descripcion!: string
}