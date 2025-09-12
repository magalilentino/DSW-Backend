import {
  Entity,
  Property,
  ManyToMany,
  Cascade,
  PrimaryKey,
  Collection
} from '@mikro-orm/core'
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
    descripcion!: string

  @Property({ nullable: false })
    cantTurnos!: number
  
  @Property({ nullable: false })
    precio!: number

  @ManyToMany(() => Producto, producto => producto.servicios, { cascade: [Cascade.ALL], owner: true })
    productos = new Collection<Producto>(this);

  @ManyToMany(() => Tono, (tono) => tono.servicios, {cascade: [Cascade.ALL], owner: true })
    tonos = new Collection<Tono>(this)

  @ManyToMany(() => Atencion, atencion => atencion.servicios) 
    atenciones = new Collection<Atencion>(this);

}