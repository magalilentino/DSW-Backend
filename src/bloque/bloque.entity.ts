import {
  Entity,
  ManyToOne,
  Property,
  Rel,
  PrimaryKey,
  Enum
} from '@mikro-orm/core';
import { Atencion } from '../atencion/atencion.entity.js';
import { Persona } from '../persona/persona.entity.js';

@Entity()
export class Bloque {
  @PrimaryKey()
  id!: number;

  @Property()
  fecha!: Date; 

  @Property({ fieldName: 'hora_inicio' })
  horaInicio!: string; 

  @Property({ fieldName: 'hora_fin' })
  horaFin!: string; 

  @ManyToOne(() => Persona, { fieldName: 'peluquero' })
  peluquero!: Rel<Persona>;

  @Enum(() => ["libre", "ocupado"])
  estado: "libre" | "ocupado" = "libre";

  @ManyToOne(() => Atencion, { fieldName: 'atencion', nullable: true })
  atencion?: Rel<Atencion>;
}