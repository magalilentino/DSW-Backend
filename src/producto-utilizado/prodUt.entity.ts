import {
  Entity,
  Property,
  ManyToOne,
  PrimaryKey,
  Rel
} from '@mikro-orm/core'
import { Producto } from '../producto/producto.entity.js'
import { AtSer } from '../atencion-servicio/atSer.entity.js'

@Entity()
export class ProdUt {
  @PrimaryKey()
    id!: number

  @Property({ nullable: false })
    cantidad!: number

  @ManyToOne(() => Producto, {fieldName : 'producto'})
    producto!: Rel<Producto>

  @ManyToOne(() => AtSer, {fieldName : 'atSer'})
    atSer!: Rel<AtSer>

}