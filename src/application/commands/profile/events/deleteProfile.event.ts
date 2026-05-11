import { UserId } from "src/core/value-objects/userid.vo";

export class DeleteProfileEvent {
    constructor(
        public readonly authId: UserId,
        public readonly error: string
    ){
    }
}

