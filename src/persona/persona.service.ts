import { EntityManager } from '@mikro-orm/core';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Persona } from './persona.entity.js';


const JWT_SECRET = process.env.JWT_SECRET || 'replace_this_secret';
const BCRYPT_SALT_ROUNDS = 10;

export class PersonaService {
  private em: EntityManager;

  constructor(em: EntityManager) {
    this.em = em;
  }

/*async register(username: string, password: string, type: 'admin' | 'client' = 'client') {
  const exists = await this.em.findOne(User, { username });
  if (exists) throw new Error('Usuario ya existe');

  const hash = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
  const user = this.em.create(User, { username, password: hash, role });
  await this.em.persistAndFlush(user);
  return { id: user.id, username: user.username, role: user.role };
}
*/

  async authenticate(dni: string, clave: string) {
    const persona = await this.em.findOne(Persona, { dni });
    if (!persona) return null;

    const ok = await bcrypt.compare(clave, persona.clave);
    if (!ok) return null;

    const token = jwt.sign(
    { id: persona.idPersona, username: persona.dni, type: persona.type },
    JWT_SECRET,
    { expiresIn: '1h' }
);

return { token, user: { id: persona.idPersona, username: persona.dni, type: persona.type } };

  }

  // helper to verify token in middleware (optional)
  verifyToken(token: string) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return null;
    }
  }
}
