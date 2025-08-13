import {
  Entity,
  Property,
  PrimaryKey,
  Enum,
  BeforeCreate,
  BeforeUpdate
} from '@mikro-orm/core'
import bcrypt from 'bcrypt';


@Entity({ 
  discriminatorColumn: 'type',
  abstract: true 
})
export class Persona {
    @PrimaryKey()
    idPersona!: number  

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
    
    @Property({ nullable: false })
    mail!: string 

    @Enum(() => ['peluquero', 'cliente'])
    type!: 'peluquero' | 'cliente'

  }

   /* // Hook para encriptar la contraseña antes de guardar
  @BeforeCreate()
  @BeforeUpdate()
  async encriptarClave() {
    if (this.clave && !this.clave.startsWith('$2a$')) {
      // Solo encripta si no está ya encriptada
      this.clave = await bcrypt.hash(this.clave, 10)
    }
  }

  // Método para verificar contraseña
  async verificarClave(claveUsuario: string): Promise<boolean> {
    return bcrypt.compare(claveUsuario, this.clave)
  }

  // Método para obtener datos públicos (sin password)
  toJSON() {
    const { clave, ...publicData } = this
    return publicData
  }

}*/