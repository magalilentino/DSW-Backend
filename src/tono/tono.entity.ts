import {
  Entity,
  Property,
  ManyToMany,
  Cascade,
  ManyToOne,
  Rel,
  Collection,
  PrimaryKey,
  OneToMany
} from '@mikro-orm/core'
import { AtSer } from '../atencion-servicio/atSer.entity.js'
import { Formula } from '../formula/formula.entity.js'

@Entity()
export class Tono {
  @PrimaryKey()
  idTono!: number

  @Property({ nullable: false })
  nombre!: String

  @Property({ nullable: false })
  activo!: boolean

  //@ManyToMany(() => Servicio, (servicio) => servicio.tonos, {cascade: [Cascade.ALL]})
  //servicios = new Collection<Servicio>(this)

  
  @OneToMany(() => Formula, (formula) => formula.tono , {cascade: [Cascade.ALL]})
    formulas = new Collection<Formula>(this) 

  @OneToMany(() => AtSer, (atSer) => atSer.tono , {cascade: [Cascade.ALL]})
    atSers = new Collection<AtSer>(this)
}