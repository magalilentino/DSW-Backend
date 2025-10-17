import {
  Entity,
  Property,
  Cascade,
  PrimaryKey,
  OneToMany,
  Collection
} from '@mikro-orm/core'
import { Producto } from '../producto/producto.entity.js'

@Entity()
export class Categoria {
  @PrimaryKey()
  idCategoria!: number

  @Property({ nullable: false })
  nombreCategoria!: string

  @OneToMany(() => Producto, (producto) => producto.categoria , {cascade: [Cascade.ALL, Cascade.REMOVE]})
  productos= new Collection<Producto>(this) 
}







