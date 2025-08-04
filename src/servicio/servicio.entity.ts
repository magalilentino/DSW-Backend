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
import { Tono } from '../tono/tono.entity.js'
import { Atencion } from '../atencion/atencion.entity.js'

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

  @ManyToMany(() => Producto, producto => producto.servicios, { cascade: [Cascade.ALL], owner: true })
  productos = new Collection<Producto>(this);

  @ManyToMany(() => Tono, (tono) => tono.servicios, {cascade: [Cascade.ALL], owner: true })
  tonos = new Collection<Tono>(this)

  @ManyToMany(() => Atencion, atencion => atencion.servicios) 
    atenciones = new Collection<Atencion>(this);

}