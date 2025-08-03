import {
  Entity,
  OneToMany,
  Property,
  Cascade,
  Collection,
  PrimaryKey
} from '@mikro-orm/core'

@Entity()
export class Marca {
  @PrimaryKey()
  idMarca!: number

  @Property({ nullable: false, unique: true })
  nombreMarca!: string 

}
