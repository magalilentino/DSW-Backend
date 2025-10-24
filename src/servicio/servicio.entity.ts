import {
  Entity,
  Property,
  ManyToMany,
  Cascade,
  PrimaryKey,
  Collection,
  OneToMany
} from '@mikro-orm/core'
import { Producto } from '../producto/producto.entity.js'
import { Tono } from '../tono/tono.entity.js'
import { Atencion } from '../atencion/atencion.entity.js'
import { AtSer } from '../atencion-servicio/atSer.entity.js'

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

  @Property({ nullable: false })
    activo!: boolean;

  @OneToMany(() => AtSer, atSer => atSer.servicio, { cascade: [Cascade.ALL] })
    atencionesServicio = new Collection<AtSer>(this);
}
