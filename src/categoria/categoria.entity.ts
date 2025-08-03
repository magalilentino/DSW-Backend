import {
  Entity,
  Property,
  ManyToMany,
  Cascade,
  ManyToOne,
  Rel,
  PrimaryKey,
} from '@mikro-orm/core'

@Entity()
export class Categoria {
  @PrimaryKey()
  idCategoria!: number

  @Property({ nullable: false })
  nombreCategoria!: string
}