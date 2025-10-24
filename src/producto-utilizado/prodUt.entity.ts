import {
  Entity,
  Property,
  ManyToOne,
  PrimaryKey,
  Rel
} from '@mikro-orm/core'
import { AtSer } from '../atencion-servicio/atSer.entity.js'
import { ProdMar } from '../productos-marcas/prodMar.entity.js'

@Entity()
export class ProdUt {
  @PrimaryKey()
    id!: number

  @Property({  type: 'float', nullable: false })
    cantidad!: number

  @ManyToOne(() => ProdMar, {fieldName : 'prodMar'})
    prodMar!: Rel<ProdMar>

  @ManyToOne(() => AtSer, {fieldName : 'atSer'})
    atSer!: Rel<AtSer>
}