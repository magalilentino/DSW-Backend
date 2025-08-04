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

  @ManyToMany(() => Marca, marca => marca.productos, {cascade: [Cascade.ALL], owner: true }) //agregue owner
  marcas = new Collection<Marca>(this);

  @ManyToMany(() => Servicio, servicio => servicio.productos)
  servicios = new Collection<Servicio>(this);

  //falta la relacion con tono pero me parece que faltaria una tabla "formula"
  //tambien falta atencion?
}
