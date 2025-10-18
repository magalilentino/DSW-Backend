import {
  Entity,
  Property,
  Cascade,
  Collection,
  ManyToMany,
  PrimaryKey,
  Rel,
  ManyToOne
} from '@mikro-orm/core'
import { Producto } from '../producto/producto.entity.js';
import { Tono } from '../tono/tono.entity.js';

@Entity()
export class Formula{ 
@PrimaryKey()
    idFormula!: number

@Property({ nullable: false })
  cantidad!: number

// @ManyToMany(() => Producto, producto => producto.formulas, {cascade: [Cascade.ALL], owner: true }) 
//   productos = new Collection<Producto>(this);

 @ManyToOne(() => Producto, {fieldName : 'producto'})
    producto!: Rel<Producto>

 @ManyToOne(() => Tono, {fieldName : 'tono'})
    tono!: Rel<Tono>


}

