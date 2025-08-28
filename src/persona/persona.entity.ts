import {
  Entity,
  Property,
  PrimaryKey,
  Enum,
  OneToMany,
  Cascade,
  Collection
} from '@mikro-orm/core'
import { Atencion } from '../atencion/atencion.entity.js';

@Entity({ discriminatorColumn: 'type'})
export class Persona {
    @PrimaryKey()
    idPersona?: number  

    @Property({ nullable: false, unique: true})
    dni!: string
    
    @Property({ nullable: false, hidden: true}) //  hidden: true oculta el campo en JSON
    clave!: string

    @Property({ nullable: false })
    nombre!: string 

    @Property({ nullable: false })
    apellido!: string 

    @Property({ nullable: false})
    telefono!: string
    
    @Property({ nullable: false, unique: true })
    email!: string 

    @Enum(() => ["peluquero", "cliente"])
    type!: "peluquero" | "cliente"

    @OneToMany(() => Atencion, (atencion) => atencion.cliente , {cascade: [Cascade.ALL]})
    clientes = new Collection<Atencion>(this) 

    @OneToMany(() => Atencion, (atencion) => atencion.peluquero , {cascade: [Cascade.PERSIST]})
    peluqueros = new Collection<Atencion>(this)

  
}