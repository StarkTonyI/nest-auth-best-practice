export class DeleteProfileEvent {
    constructor(
        public readonly authId: string,
        public readonly error: Error
    ){
    }
}

