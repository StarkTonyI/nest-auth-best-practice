import { IsEmail, IsString, MinLength } from "class-validator";

export class ChangePasswordDto {
    @IsString()
    @MinLength(8)
    newPassword!: string;
    @MinLength(8)
    oldPassword!: string
}