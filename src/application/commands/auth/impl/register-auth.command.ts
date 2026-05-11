import RegisterUserDto from "src/application/dtos/request/auth/register-identity.dto";

export class RegisterCommand {
    constructor(public readonly user: RegisterUserDto){}
}