import { User } from "@prisma/client";
import RegisterUserDto from "src/auth/dto/registerUser.dto";
import { SafeUser, UserWithPassword } from "src/types/prisma-user";

export interface IAuthRepository {
  create:(user: RegisterUserDto)=> Promise<SafeUser>
  findByEmail:(email: string, withPassword?: boolean)=> Promise<SafeUser | UserWithPassword | null>
  update: (id: string, update: Partial<User>)=> Promise<SafeUser>
  findById(id: string, withPassword?: true): Promise<UserWithPassword | SafeUser | null>;
}