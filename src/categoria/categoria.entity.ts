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
import { Precio } from '../precio/precio.entity.js'
import { Producto } from '../producto/producto.entity.js'

@Entity()
export class Categoria {
  @PrimaryKey()
  idCategoria!: number

  @Property({ nullable: false })
  nombreCategoria!: string

  @OneToMany(() => Producto, (producto) => producto.categoria , {cascade: [Cascade.ALL]})
  categorias= new Collection<Producto>(this) //cambie el nombre de precios a categorias
}







