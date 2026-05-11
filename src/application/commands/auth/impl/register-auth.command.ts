import RegisterUserDto from "src/application/dtos/request/auth/registerUser.dto";

export class RegisterCommand {
    constructor(public readonly user: RegisterUserDto){}
}