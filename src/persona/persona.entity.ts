import {
  Entity,
  Property,
  PrimaryKey,
  Enum,
  OneToMany,
  Cascade,
  Collection
} from '@mikro-orm/core';
import { Atencion } from '../atencion/atencion.entity.js';

@Entity()
export class Persona {
  @PrimaryKey({ fieldName: 'id_persona' })
  idPersona?: number;

  @Property({ nullable: false, unique: true })
  dni!: string;

  @Property({ nullable: false, hidden: true })
  clave!: string;

  @Property({ nullable: false })
  nombre!: string;

  @Property({ nullable: false })
  apellido!: string;

  @Property({ nullable: false })
  telefono!: string;

  @Property({ nullable: false, unique: true })
  email!: string;

  @Enum(() => ["peluquero", "cliente"])
  type!: "peluquero" | "cliente";

  @OneToMany(() => Atencion, atencion => atencion.cliente, { cascade: [Cascade.ALL] })
  atencionesCli = new Collection<Atencion>(this);

  @OneToMany(() => Atencion, atencion => atencion.peluquero, { cascade: [Cascade.PERSIST] })
  atencionesPel = new Collection<Atencion>(this);
}