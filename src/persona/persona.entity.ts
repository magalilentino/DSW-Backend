import {
  Entity,
  Property,
  PrimaryKey
} from '@mikro-orm/core'


@Entity()
export class Persona {
    @PrimaryKey()
    idPersona!: number  //creo q estaba bien antes con lo de baseEntity xq ahora no me anda el http

    @Property({ nullable: false, unique: true})
    dni!: string
    
    @Property({ nullable: false })
    nombre!: string 

    @Property({ nullable: false })
    apellido!: string 

    @Property({ nullable: false})
    telefono!: string
    
    @Property({ nullable: false })
    mail!: string 

}