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
export class Servicio extends BaseEntity {
  @Property({ nullable: false })
  name!: string

  @Property({ nullable: false })
  tiempoDemora!: number

}