import {
  Entity,
  Property,
  ManyToMany,
  OneToMany,
  Cascade,
  ManyToOne,
  Rel,
  PrimaryKey,
  Collection
} from '@mikro-orm/core'
import { Precio } from '../precio/precio.entity.js'
import { Producto } from '../producto/producto.entity.js'

@Entity()
export class Servicio {
  @PrimaryKey()
    codServicio!: number
  
  @Property({ nullable: false })
    nombreServicio!: string

  @Property({ nullable: false })
    tiempoDemora!: number

  @OneToMany(() => Precio, (precio) => precio.servicio, {cascade: [Cascade.ALL]})
    precios= new Collection<Precio>(this)

  @ManyToMany(() => Producto, producto => producto.servicios, { cascade: [Cascade.ALL] })
  productos = new Collection<Producto>(this);
}