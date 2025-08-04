import {
  Entity,
  ManyToOne,
  Property,
  Cascade,
  Collection,
  OneToMany,
  ManyToMany,
  Rel,
  PrimaryKey
} from '@mikro-orm/core'
import { Servicio } from '../servicio/servicio.entity.js';
import { Cliente } from '../persona/cliente.entity.js';
import { Peluquero } from '../persona/peluquero.entity.js';
import { Turno } from '../turno/turno.entity.js';
import { Descuento } from '../descuento/descuento.entity.js';
import { Pago } from '../pago/pago.entity.js';

@Entity()
export class Atencion {
@PrimaryKey()
    idAtencion!: number

  @Property({ nullable: false })
    estado!: string 

  @ManyToMany(() => Servicio, servicio => servicio.atenciones, {cascade: [Cascade.ALL], owner: true }) 
    servicios = new Collection<Servicio>(this);

  @ManyToOne(() => Cliente, {fieldName : 'cliente'})
    cliente!: Rel<Cliente>

  @ManyToOne(() => Peluquero, {fieldName : 'peluquero'})
    peluquero!: Rel<Peluquero> 

  @OneToMany(() => Turno, (turno) => turno.atencion , {cascade: [Cascade.ALL]})
    turnos = new Collection<Turno>(this) 

   @OneToMany(() => Pago, (pago) => pago.atencion , {cascade: [Cascade.ALL]})
    pagos = new Collection<Pago>(this) 

    @ManyToMany(() => Descuento, descuento => descuento.atenciones, {cascade: [Cascade.ALL], owner: true }) 
    descuentos = new Collection<Descuento>(this);
}
