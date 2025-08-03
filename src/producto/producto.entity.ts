import {
  Entity,
  Property,
  ManyToMany,
  Cascade,
  ManyToOne,
  Rel,
  PrimaryKey,
} from '@mikro-orm/core'
import { Categoria } from '../categoria/categoria.entity.js';

@Entity()
export class Producto {
  @PrimaryKey()
  idProducto!: number

  @Property({ nullable: false })
  descripcion!: string

  @ManyToOne(() => Categoria, {fieldName : 'categoria'})
    categoria!: Rel<Categoria>
}