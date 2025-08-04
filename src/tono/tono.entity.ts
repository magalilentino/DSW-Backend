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
import { Servicio } from '../servicio/servicio.entity.js'
import { Formula } from '../formula/formula.entity.js'

@Entity()
export class Tono {
  @PrimaryKey()
  idTono!: number

  @Property({ nullable: false })
  nombre!: String

  @ManyToMany(() => Servicio, (servicio) => servicio.tonos, {cascade: [Cascade.ALL]})
  servicios = new Collection<Servicio>(this)

  
  @OneToMany(() => Formula, (formula) => formula.tono , {cascade: [Cascade.ALL]})
    formulas = new Collection<Formula>(this) 
}