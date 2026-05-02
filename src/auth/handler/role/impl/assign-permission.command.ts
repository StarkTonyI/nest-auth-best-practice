export class AssingPermissionCommand{
    constructor(
        public readonly role: string, 
        public readonly action: string, 
        public readonly resource: string
    ){}
}
