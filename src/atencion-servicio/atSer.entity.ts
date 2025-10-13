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
import { ProdUt } from '../producto-utilizado/prodUt.entity.js';
import { Atencion } from '../atencion/atencion.entity.js';
import { Tono } from '../tono/tono.entity.js';

@Entity()
export class AtSer {
  @PrimaryKey()
  idAtSer?: number;

  @ManyToOne(() => Atencion, {fieldName : 'atencion_id'})
  atencion!: Rel<Atencion>

  @ManyToOne(() => Servicio, {fieldName : 'servicio_id'})
  servicio!: Rel<Servicio>

  @ManyToOne(() => Tono, {fieldName : 'tono_id', nullable: true})
  tono!: Rel<Tono>

  @OneToMany(() => ProdUt, prodUt => prodUt.atSer, { cascade: [Cascade.ALL] })
  productosUtilizados = new Collection<ProdUt>(this);

}

  