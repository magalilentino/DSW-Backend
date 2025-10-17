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
import { Formula } from '../formula/formula.entity.js';

@Entity()
export class Producto {
  @PrimaryKey()
    idProducto!: number

  @Property({ nullable: false })
    descripcion!: string

  @ManyToOne(() => Categoria, {fieldName : 'categoria'})
    categoria!: Rel<Categoria>

  @ManyToMany(() => Marca, marca => marca.productos, {cascade: [Cascade.ALL, Cascade.REMOVE], owner: true }) 
    marcas = new Collection<Marca>(this);

  //@ManyToMany(() => Servicio, servicio => servicio.productos)
  //servicios = new Collection<Servicio>(this);

  @ManyToMany(() => Formula, formula => formula.productos,{cascade: [Cascade.ALL, Cascade.REMOVE] }) 
  formulas = new Collection<Formula>(this);


}
