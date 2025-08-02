export interface Repository<T> {
  findAll(): Promise<T[] | undefined>
  findOne(item: { codigo: string }): Promise<T[] | undefined>
  add(item: T): Promise<T | undefined>
  update(codigo: string, item: T): Promise<T | undefined>
  delete(item: { codigo: string }): Promise<T | undefined>
}