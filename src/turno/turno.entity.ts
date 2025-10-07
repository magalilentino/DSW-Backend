import {
  Entity,
  Property,
  PrimaryKey,
  ManyToMany,
  Cascade,
  ManyToOne,
  Rel,
} from '@mikro-orm/core'
import { Atencion } from '../atencion/atencion.entity.js'
import { Bloque } from '../bloque/bloque.entity.js'
import { Persona } from '../persona/persona.entity.js'

@Entity()
export class Turno  {
  @PrimaryKey()
  idTurno?: number

  @Property({ nullable: false })
    estado!: "pendiente" | "finalizado" | "cancelado" 

  @ManyToOne(() => Atencion, {fieldName : 'atencion'})
  atencion!: Rel<Atencion>

  @ManyToOne(() => Bloque, {fieldName : 'bloque'})
  bloque!: Rel<Bloque> 
  
  

}