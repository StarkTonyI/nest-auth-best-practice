import LoginUserDto from "src/dto/request/auth/loginUser.dto";

export class LoginEvent {
    constructor(public readonly login: LoginUserDto){}
}