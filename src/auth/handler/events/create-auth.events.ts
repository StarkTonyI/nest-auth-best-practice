import { User } from "src/core/entities/user.entity";
import RegisterUserDto from "src/dto/request/auth/registerUser.dto";


export class CommandCreateAuthEvent {
    constructor(public readonly user: User){}
}