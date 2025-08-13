import {
  Entity,
  OneToMany,
  Collection,
  Cascade
} from '@mikro-orm/core'
import { Persona } from './persona.entity.js'
import { Atencion } from '../atencion/atencion.entity.js';


@Entity()
export class Cliente extends Persona {

  @OneToMany(() => Atencion, (atencion) => atencion.cliente , {cascade: [Cascade.ALL]})
  clientes = new Collection<Atencion>(this) 

  constructor(){
    super()
    this.type = 'cliente'
  }
}