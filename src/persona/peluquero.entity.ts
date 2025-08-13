import {
  Cascade,
  Collection,
  Entity,
  OneToMany
} from '@mikro-orm/core'
import { Persona } from './persona.entity.js'
import { Atencion } from '../atencion/atencion.entity.js';


@Entity()
export class Peluquero extends Persona {

  @OneToMany(() => Atencion, (atencion) => atencion.peluquero , {cascade: [Cascade.PERSIST]})
  peluqueros = new Collection<Atencion>(this)

  constructor(){
    super()
    this.type = 'peluquero'
  }

}