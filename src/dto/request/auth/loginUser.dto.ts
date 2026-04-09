import { Role } from "@prisma/client";
import { IsEmail, IsEnum, IsString, MinLength } from "class-validator";

export default class LoginUserDto {
    @IsEmail()
    email!: string;
    @IsString()
    @MinLength(2)
    password!: string;
    @IsEnum(Role)
    role!: string;
}