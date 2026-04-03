import { User } from "src/core/entities/user.entity";
import { SafeUser, UserWithPassword } from "src/types/prisma-user";
import { User as PrismaUser } from "@prisma/client";
export interface IUserRepository {
  create:(user: User)=> Promise<User>
  findByEmail:(email: string, withPassword?: boolean)=> Promise<User | null>
  update: (id: string, update: Partial<PrismaUser>)=> Promise<User>
  findById(id: string, withPassword?: true): Promise<User | null>;
  delete(id: string): Promise<SafeUser>
}