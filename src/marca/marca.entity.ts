import {
  Entity,
  OneToMany,
  Property,
  Cascade,
  Collection,
  PrimaryKey,
  ManyToMany
} from '@mikro-orm/core'
import { ProdMar } from '../productos-marcas/prodMar.entity.js';

@Entity()
export class Marca {
  @PrimaryKey()
  idMarca!: number

  @Property({ nullable: false, unique: true })
  nombre!: string 

  @OneToMany(() => ProdMar, (prodMar) => prodMar.marca, { cascade: [Cascade.ALL] })
  productosMarcas = new Collection<ProdMar>(this);
}
