export interface Repository<T> {
  findAll(): T[] | undefined
  findOne(item: { codigo: string }): T | undefined
  add(item: T): T | undefined
  update(item: T): T | undefined
  delete(item: { codigo: string }): T | undefined
}
//sirve como base para cualquier clase que quiera utilizar los metodos basicos de accseso y manipulacion
//de datos (el crud)