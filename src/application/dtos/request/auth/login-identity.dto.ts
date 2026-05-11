import { IsEmail, IsEnum, IsString, MinLength } from "class-validator";

export default class LoginUserDto {
    @IsEmail()
    email!: string;
    @IsString()
    @MinLength(2)
    password!: string;
}