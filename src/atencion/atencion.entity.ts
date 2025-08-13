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
import { Turno } from '../turno/turno.entity.js';
import { Descuento } from '../descuento/descuento.entity.js';
import { Pago } from '../pago/pago.entity.js';
import { Persona } from '../persona/persona.entity.js';

@Entity()
export class Atencion {
@PrimaryKey()
    idAtencion!: number

  @Property({ nullable: false })
    estado!: string 

  @ManyToMany(() => Servicio, servicio => servicio.atenciones, {cascade: [Cascade.ALL], owner: true }) 
    servicios = new Collection<Servicio>(this);

  @ManyToOne(() => Persona, {fieldName : 'cliente'})
    cliente!: Rel<Persona>

  @ManyToOne(() => Persona, {fieldName : 'peluquero'})
    peluquero!: Rel<Persona>

  @OneToMany(() => Turno, (turno) => turno.atencion , {cascade: [Cascade.ALL]})
    turnos = new Collection<Turno>(this) 

   @OneToMany(() => Pago, (pago) => pago.atencion , {cascade: [Cascade.ALL]})
    pagos = new Collection<Pago>(this) 

    @ManyToMany(() => Descuento, descuento => descuento.atenciones, {cascade: [Cascade.ALL], owner: true }) 
    descuentos = new Collection<Descuento>(this);
}
