import { UserId } from "src/value-objects/userid.vo";

export class DeleteProfileAndUserEvent {
    constructor(
        public readonly authId: UserId
    ){}
}