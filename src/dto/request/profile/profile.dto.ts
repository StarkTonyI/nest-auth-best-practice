import { IsEmail, isString, IsString, MinLength } from "class-validator";

export class ProfileUserDto {
    @IsString()
    @MinLength(6)
    username: string;
    @IsString()
    authId: string;
    @IsString()
    lastname: string
    
}