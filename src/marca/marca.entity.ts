import {
  Entity,
  OneToMany,
  Property,
  Cascade,
  Collection,
  PrimaryKey,
  ManyToMany
} from '@mikro-orm/core'
import { Producto } from '../producto/producto.entity.js';

@Entity()
export class Marca {
  @PrimaryKey()
  idMarca!: number

  @Property({ nullable: false, unique: true })
  nombre!: string 

  @ManyToMany(() => Producto, (producto) => producto.marcas)
  productos = new Collection<Producto>(this);
}
