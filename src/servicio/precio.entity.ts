import {
  Entity,
  Property,
  ManyToMany,
  Cascade,
  ManyToOne,
  Rel,
  PrimaryKey
} from '@mikro-orm/core'
import { Servicio } from './servicio.entity.js';

@Entity()
export class Precio {
    @PrimaryKey()
    fechaImporte!: Date

    @ManyToOne(() => Servicio, {name: 'cod_servicio', nullable: false})
    servicio!: Rel<Servicio>

    @Property({ nullable: false })
    importe!: number
}