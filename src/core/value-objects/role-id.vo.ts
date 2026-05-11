import { EntityId } from "./entity-id.vo";

export class RoleId extends EntityId {
    constructor(roleId: string){
        super(roleId)
    }

    static createId(value?: string){
        return new RoleId(value || EntityId.generatedId())
    }

    static fromString(id: string){
        return new RoleId(id)
    }

}
