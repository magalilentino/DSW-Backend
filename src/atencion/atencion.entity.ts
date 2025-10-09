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
    cliente!: Rel<Persona>;

  @ManyToOne(() => Persona, { fieldName: 'peluquero' })
    peluquero!: Rel<Persona>;

  @Property({ nullable: false })
    fecha!: Date;

  @Property({ nullable: false })
    horaInicio!: Date;

  @Property({ nullable: false })
    horaFin!: Date;

  @Property({ nullable: false })
    estado!: "pendiente" | "finalizado" | "cancelado";

  @OneToMany(() => AtSer, atSer => atSer.atencion, { cascade: [Cascade.ALL] })
  atencionServicios = new Collection<AtSer>(this);

  @OneToMany(() => Pago, pago => pago.atencion, { cascade: [Cascade.ALL] })
    pagos = new Collection<Pago>(this);

  @ManyToMany(() => Descuento, descuento => descuento.atenciones, { cascade: [Cascade.ALL], owner: true }) 
    descuentos = new Collection<Descuento>(this);
}  

/*@OneToMany(() => Turno, turno => turno.atencion, { cascade: [Cascade.ALL] })
    turnos = new Collection<Turno>(this);*/