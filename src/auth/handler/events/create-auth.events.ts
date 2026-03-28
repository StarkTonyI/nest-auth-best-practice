import RegisterUserDto from "src/dto/request/auth/registerUser.dto";


export class CommandCreateAuthEvent {
    constructor(public readonly registerUser: RegisterUserDto){}
}