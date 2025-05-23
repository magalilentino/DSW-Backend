import crypto from 'node:crypto'

export class Servicio {
  constructor(
    public name: string,
    public tiempoDemora: number,
    public codigo = crypto.randomUUID(),
  ) {}  
}