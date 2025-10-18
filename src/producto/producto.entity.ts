import {
  Entity,
  Property,
  ManyToMany,
  Cascade,
  ManyToOne,
  Rel,
  PrimaryKey,
  Collection,
  OneToMany,
} from '@mikro-orm/core'
import { Categoria } from '../categoria/categoria.entity.js';
import { Marca } from '../marca/marca.entity.js';
import { Servicio } from '../servicio/servicio.entity.js';
import { Formula } from '../formula/formula.entity.js';
import { ProdMar } from '../productos-marcas/prodMar.entity.js';

@Entity()
export class Producto {
  @PrimaryKey()
    idProducto!: number

  @Property({ nullable: false })
    descripcion!: string

  @Property({ nullable: false })
    activo!: boolean

  @ManyToOne(() => Categoria, {fieldName : 'categoria'})
    categoria!: Rel<Categoria>
    
  //@ManyToMany(() => Servicio, servicio => servicio.productos)
  //servicios = new Collection<Servicio>(this);

  // @ManyToMany(() => Formula, formula => formula.productos,{cascade: [Cascade.ALL, Cascade.REMOVE] }) 
  // formulas = new Collection<Formula>(this); 

  @OneToMany(() => ProdMar, (prodMar) => prodMar.producto, { cascade: [Cascade.ALL] })
  productosMarcas = new Collection<ProdMar>(this);



}
