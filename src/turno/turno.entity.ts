import {
  Entity,
  Property,
  ManyToMany,
  Cascade,
  ManyToOne,
  Rel,
} from '@mikro-orm/core'
import { BaseEntity } from '../shared/baseEntity.entity.js'

@Entity()
export class Turno extends BaseEntity {
  @Property({ nullable: false })
  hora!: Date

  @Property({ nullable: false })
  fecha!: Date

  @Property({ nullable: false })
  estado!: String

}