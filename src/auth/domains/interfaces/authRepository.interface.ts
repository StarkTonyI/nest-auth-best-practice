import { Injectable } from "@nestjs/common";
import { User } from "@prisma/client";
import RegisterUserDto from "src/auth/dto/registerUser.dto";
import { SafeUser } from "src/types/prisma-user";

export interface IAuthRepositoryService {
  create:(user: RegisterUserDto)=> Promise<SafeUser>
  findById:(id: string)=> Promise<SafeUser>
  findByEmail:(email: string)=> Promise<SafeUser>
  update: (id: string, update: Partial<User>)=> Promise<SafeUser>
}