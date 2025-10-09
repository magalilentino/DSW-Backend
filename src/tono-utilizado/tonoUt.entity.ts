import {
  Entity,
  Property,
  ManyToOne,
  PrimaryKey,
  Rel
} from '@mikro-orm/core'
import { AtSer } from '../atencion-servicio/atSer.entity.js'
import { Tono } from '../tono/tono.entity.js'

@Entity()
export class TonoUt {
  @PrimaryKey()
    id!: number

  @Property({ nullable: false })
    cantidad!: number

  @ManyToOne(() => Tono, {fieldName : 'tono'})
    tono!: Rel<Tono>

  @ManyToOne(() => AtSer, {fieldName : 'atSer'})
    atSer!: Rel<AtSer>

}