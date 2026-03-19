export class DeleteProfileAndUserEvent {
    constructor(
        public readonly authId: string,
        public readonly id: string
    ){}
}