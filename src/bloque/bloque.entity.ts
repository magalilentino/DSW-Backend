import {
  Entity,
  Property,
  PrimaryKey,
  OneToMany,
  Collection,
  Cascade,
  ManyToOne,
  Rel,
} from '@mikro-orm/core'
import { Turno } from '../turno/turno.entity.js'

@Entity()
export class Bloque  {
  @PrimaryKey()
  idBloque?: number

  @Property({ nullable: false })
  horaIncio!: string

  @Property({ nullable: false })
  horaFin!: string

@OneToMany(() => Turno, (turno) => turno.bloque , {cascade: [Cascade.ALL]})
  bloques = new Collection<Bloque>(this) 


}
