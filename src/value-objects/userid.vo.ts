import { EntityId } from "./entity-id.vo";

export class UserId extends EntityId{
    constructor(id:string){
        super(id)
    }

    static create(value?: string): UserId{
        return new UserId(value || EntityId.generatedId())
    }

    static fromString(value: string): UserId{
        return new UserId(value)
    }
}
