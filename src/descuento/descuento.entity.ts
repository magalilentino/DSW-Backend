import {
  Entity,
  Property,
  ManyToMany,
  Cascade,
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
  cantAtencionNecesaria!: number //inicializar en 1 cuando se crea
  //resetear - multiplo cantAtencionNecesaria 

  @Property({ nullable: false })
  estado!: boolean //inicializar en true

  @ManyToMany(() => Atencion, atencion => atencion.descuentos, {cascade: [Cascade.ALL]}) 
  atenciones = new Collection<Atencion>(this);
}