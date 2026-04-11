
import { Profile } from "src/core/entities/profile.entity";

export class authUserCreatedEvent {
    constructor(public readonly profile: Profile){}
}


