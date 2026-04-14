import { EntityId } from "./entity-id.vo";

export class PermissionId extends EntityId {
    constructor(id: string){
        super(id)
    }

    static createId(value?: string){
        return new PermissionId(value || EntityId.generatedId())
    }

    static fromString(id: string){
        return new PermissionId(id)
    }
}
