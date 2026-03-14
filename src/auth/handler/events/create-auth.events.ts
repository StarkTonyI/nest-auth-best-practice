import RegisterUserDto from "src/auth/dto/registerUser.dto";

export class CommandCreateAuthEvent {
    constructor(public readonly registerUser: RegisterUserDto){}
}