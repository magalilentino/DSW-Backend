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
export class Tono extends BaseEntity {
  
  @Property({ nullable: false })
  nombre!: String

}