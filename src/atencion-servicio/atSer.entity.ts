import {
  Entity,
  ManyToOne,
  Property,
  Cascade,
  Collection,
  OneToMany,
  Rel,
  PrimaryKey
} from '@mikro-orm/core';
import { Servicio } from '../servicio/servicio.entity.js';
import { TonoUt } from '../tono-utilizado/tonoUt.entity.js';
import { ProdUt } from '../producto-utilizado/prodUt.entity.js';
import { Atencion } from '../atencion/atencion.entity.js';

@Entity()
export class AtSer {
  @PrimaryKey()
  idAtSer?: number;

  @ManyToOne(() => Atencion, {fieldName : 'atencion'})
  atencion!: Rel<Atencion>

  @ManyToOne(() => Servicio, {fieldName : 'atencion'})
  servicio!: Rel<Servicio>

  @OneToMany(() => ProdUt, prodUt => prodUt.atSer, { cascade: [Cascade.ALL] })
  productosUtilizados = new Collection<ProdUt>(this);

  @OneToMany(() => TonoUt, tonoUt => tonoUt.atSer, { cascade: [Cascade.ALL] })
  tonosUtilizados = new Collection<TonoUt>(this);

}

  