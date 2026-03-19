export class DeleteProfileEvent {
    constructor(
        public readonly authId: string,
        public readonly id: string,
        public readonly error: Error
    ){
    }
}

