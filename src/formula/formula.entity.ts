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
import { Tono } from '../tono/tono.entity.js';
import { ProdMar } from '../productos-marcas/prodMar.entity.js';

@Entity()
export class Formula{ 
@PrimaryKey()
    idFormula!: number

@Property({ nullable: false })
  cantidad!: number

@Property({ nullable: false })
  activo!: boolean

@ManyToOne(() => ProdMar, {fieldName : 'prodMar'})
    prodMar!: Rel<ProdMar>

@ManyToOne(() => Tono, {fieldName : 'tono'})
    tono!: Rel<Tono>


}

