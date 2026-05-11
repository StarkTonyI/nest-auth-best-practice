import LoginUserDto from "src/application/dtos/request/auth/login-identity.dto";

export class LoginCommand {
    constructor(public readonly login: LoginUserDto){}
}