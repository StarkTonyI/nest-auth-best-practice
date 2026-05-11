import { UserId } from "src/core/value-objects/userid.vo";

export class DeleteProfileAndUserCommand {
    constructor(
        public readonly authId: UserId
    ){}
}