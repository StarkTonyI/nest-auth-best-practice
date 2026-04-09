import { Identity as PrismaIdentity } from '@prisma/client'
import { Identity } from 'src/core/entities/Identity.entity';
import { expendedParams } from 'src/types/prisma-user';

export interface IdentityRepository {
  create:(Identity: Identity)=> Promise<Identity>
  findByEmail:(email: string, expend: Partial<expendedParams>)=> Promise<Identity | null>
  update: (id: string, update: Partial<PrismaIdentity>)=> Promise<Identity>
  findById(id: string, expend: Partial<expendedParams>): Promise<Identity | null>;
  delete(id: string)
}