import { IsBoolean, IsEmail, IsEnum, IsString, MaxLength, MinLength } from "class-validator";
export default class RegisterUserDto {
    @IsEmail()
    email!: string;
    @MinLength(8)
    @MaxLength(24)
    password!: string;
    @IsString()
    firstName!: string;
    @IsString()
    lastName!: string;
}