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
} from '@mikro-orm/core';
import { Turno } from '../turno/turno.entity.js';
import { Descuento } from '../descuento/descuento.entity.js';
import { Pago } from '../pago/pago.entity.js';
import { Persona } from '../persona/persona.entity.js';
import { AtSer } from '../atencion-servicio/atSer.entity.js';

@Entity()
export class Atencion {
  @PrimaryKey()
  idAtencion?: number;

  @ManyToOne(() => Persona, { fieldName: 'cliente' })
  cliente!: Rel<Persona>; // Persona con type = 'cliente'

  @ManyToOne(() => Persona, { fieldName: 'peluquero' })
  peluquero!: Rel<Persona>; // Persona con type = 'peluquero'

  // @ManyToMany(() => Servicio, servicio => servicio.atenciones, { cascade: [Cascade.ALL], owner: true }) 
  // servicios = new Collection<Servicio>(this);

  @Property({ nullable: false })
  fechaInicio!: Date;

  @Property({ nullable: false })
  estado!: "pendiente" | "finalizado" | "cancelado";

  // Turnos ocupados por esta atención (uno o varios)
  @OneToMany(() => Turno, turno => turno.atencion, { cascade: [Cascade.ALL] })
  turnos = new Collection<Turno>(this);

  @OneToMany(() => AtSer, atSer => atSer.atencion, { cascade: [Cascade.ALL] })
  atencionServicios = new Collection<AtSer>(this);

  @OneToMany(() => Pago, pago => pago.atencion, { cascade: [Cascade.ALL] })
  pagos = new Collection<Pago>(this);

  @ManyToMany(() => Descuento, descuento => descuento.atenciones, { cascade: [Cascade.ALL], owner: true }) 
  descuentos = new Collection<Descuento>(this);



  // getCantidadBloques(): number {
  //   return this.servicios.getItems().reduce((sum, s) => sum + s.cantTurnos, 0);
  // }
}

