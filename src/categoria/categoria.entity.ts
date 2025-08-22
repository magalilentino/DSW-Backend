import {
  Entity,
  Property,
  ManyToMany,
  Cascade,
  ManyToOne,
  Rel,
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

  @OneToMany(() => Producto, (producto) => producto.categoria , {cascade: [Cascade.ALL]})
  productos= new Collection<Producto>(this) 
}







