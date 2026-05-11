import LoginUserDto from "src/application/dtos/request/auth/loginUser.dto";

export class LoginCommand {
    constructor(public readonly login: LoginUserDto){}
}