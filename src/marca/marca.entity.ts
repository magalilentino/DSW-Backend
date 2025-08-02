import {
  Entity,
  OneToMany,
  Property,
  Cascade,
  Collection,
} from '@mikro-orm/core'
import { BaseEntity } from '../shared/baseEntity.entity.js'


@Entity()
export class Marca extends BaseEntity {
  @Property({ nullable: false, unique: true })
  name!: string 

}
