import { Role } from "@prisma/client";

export class CreateEventBus {
    constructor(
        public readonly id: string,
        public readonly username: string,
        public readonly email: string,
        public readonly password: string,
        public readonly role: Role
    ){}
}