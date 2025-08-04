import {
  Entity,
  Property,
  ManyToMany,
  Cascade,
  ManyToOne,
  Rel,
  Collection
} from '@mikro-orm/core'
import { BaseEntity } from '../shared/baseEntity.entity.js'
import { Producto } from '../producto/producto.entity.js';
import { Servicio } from '../servicio/servicio.entity.js';

@Entity()
export class Tono extends BaseEntity {
  
  @Property({ nullable: false })
  nombre!: String

   @ManyToMany(() => Servicio, servicio => servicio.tonos, {cascade: [Cascade.ALL] }) 
    servicios = new Collection<Servicio>(this);

    





}