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
import { BaseEntity } from '../shared/baseEntity.entity.js';

@Entity()
export class Marca extends BaseEntity{

  @Property({ nullable: false, unique: true })
  nombreMarca!: string 

  @ManyToMany(() => Producto, (producto) => producto.marcas)
  productos = new Collection<Producto>(this);
}
