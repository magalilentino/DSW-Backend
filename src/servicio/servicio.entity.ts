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
}