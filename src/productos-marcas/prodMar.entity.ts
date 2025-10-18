import {
  Entity,
  Property,
  ManyToOne,
  PrimaryKey,
  Rel,
  OneToMany,
  Cascade,
  Collection,
} from "@mikro-orm/core";
import { Producto } from "../producto/producto.entity.js";
import { Marca } from "../marca/marca.entity.js";
import { Formula } from "../formula/formula.entity.js";

@Entity()
export class ProdMar {
  @PrimaryKey()
  idPM!: number;

  @Property({ nullable: false })
  activo!: boolean;

  @ManyToOne(() => Producto, { fieldName: "producto" })
  producto!: Rel<Producto>;

  @ManyToOne(() => Marca, { fieldName: "marca" })
  marca!: Rel<Marca>;

  @OneToMany(() => Formula, (formula) => formula.prodMar, {
    cascade: [Cascade.ALL],
  })
  formulas = new Collection<Formula>(this);

}
