export class CreateRoleCommand {
    constructor(
        public readonly role: string, 
        public readonly description: string, 
        public readonly permissionName: string
    ){}
}