import {
  Entity,
  Property,
  ManyToMany,
  Cascade,
  ManyToOne,
  Rel,
  PrimaryKey,
  Collection
} from '@mikro-orm/core'
import { Atencion } from '../atencion/atencion.entity.js';
@Entity()
export class Descuento {
  @PrimaryKey()
  idDescuento!: number

  @Property({ nullable: false })
  porcentaje!: number

  @Property({ nullable: false })
  cantAtencionNecesaria!: number

  @ManyToMany(() => Atencion, atencion => atencion.descuentos, {cascade: [Cascade.ALL]}) 
  atenciones = new Collection<Atencion>(this);
}