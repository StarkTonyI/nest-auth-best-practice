import { IsEmail, IsEnum, IsString, MaxLength, MinLength } from "class-validator";
import { DefaultRoles } from "src/value-objects/permission-resourceAction.vo";
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
    @IsEnum(DefaultRoles)
    role!: string;
}