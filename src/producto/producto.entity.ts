import {
  Entity,
  Property,
  ManyToMany,
  Cascade,
  ManyToOne,
  Rel,
  PrimaryKey,
  Collection,
} from '@mikro-orm/core'
import { Categoria } from '../categoria/categoria.entity.js';
import { Marca } from '../marca/marca.entity.js';
import { Servicio } from '../servicio/servicio.entity.js';

@Entity()
export class Producto {
  @PrimaryKey()
    idProducto!: number

  @Property({ nullable: false })
    descripcion!: string

  @ManyToOne(() => Categoria, {fieldName : 'categoria'})
    categoria!: Rel<Categoria>

  @ManyToMany(() => Marca, marca => marca.productos, { mappedBy: "productos" })
  marcas = new Collection<Marca>(this);

  @ManyToMany(() => Servicio, servicio => servicio.productos, { mappedBy: "productos" })
  servicios = new Collection<Servicio>(this);
}
// me tira error el mappedBy