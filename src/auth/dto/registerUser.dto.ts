import { Role } from "@prisma/client";
import { IsEmail, IsEnum, IsString, MaxLength, MinLength } from "class-validator";
export default class RegisterUserDto {
    @IsString()
    username: string;
    @IsEmail()
    email: string;
    @IsEnum(Role)
    role: Role;
    @MinLength(8)
    @MaxLength(24)
    password: string;
}