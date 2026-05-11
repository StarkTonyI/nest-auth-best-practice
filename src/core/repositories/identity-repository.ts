import { Identity as PrismaIdentity } from '@prisma/client'
import { Identity } from 'src/core/entities/Identity.entity';
import { expendedParams } from 'src/types/prisma-user';

export interface iIdentityRepository {
  create:(Identity: Identity)=> Promise<Identity>
  findByEmail:(email: string)=> Promise<Identity | null>
  findById:(id: string)=> Promise<Identity | null>;
  delete:(id: string)=> void;
}