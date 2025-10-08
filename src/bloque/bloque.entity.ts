import { Turno } from '../turno/turno.entity.js'
import {
  Entity,
  Property,
  PrimaryKey,
  OneToMany,
  Collection,
  Cascade,
} from '@mikro-orm/core'

@Entity()
export class Bloque  {
  @PrimaryKey()
  idBloque?: number

  @Property({ nullable: false })
  horaInicio!: string

  @Property({ nullable: false })
  horaFin!: string

@OneToMany(() => Turno, (turno) => turno.bloque , {cascade: [Cascade.ALL]})
  turnos = new Collection<Turno>(this)}