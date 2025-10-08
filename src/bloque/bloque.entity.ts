import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity()
export class Bloque {
  @PrimaryKey()
  id!: number;

  @Property()
  fecha!: string; // 'YYYY-MM-DD'

  @Property()
  horaInicio!: string; // '09:00'

  @Property()
  horaFin!: string; // '09:45'

  @Property()
  idPeluquero!: number; // FK a Persona donde type = 'peluquero'

  @Property()
  ocupado: boolean = false;
}
