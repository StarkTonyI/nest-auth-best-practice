import LoginUserDto from "src/dto/request/auth/loginUser.dro";

export class LoginEvent {
    constructor(public readonly login: LoginUserDto){}
}