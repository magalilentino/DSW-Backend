import {
  Entity,
  Property,
  PrimaryKey,
  ManyToMany,
  Cascade,
  ManyToOne,
  Rel,
} from '@mikro-orm/core'

@Entity()
export class Turno  {
  @PrimaryKey()
  idTurno?: number

  @Property({ nullable: false })
  hora!: Date

  @Property({ nullable: false })
  fecha!: Date

  @Property({ nullable: false })
  estado!: String

}