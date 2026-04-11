import { EntityId } from "./entity-id.vo";

export class UserId extends EntityId{
    constructor(id:string){
        super(id)
    }

     static create(value?:string): UserId{
        return new UserId(value || UserId.generatedId())
    }

    static fromString(value: string): EntityId{
        return new UserId(value)
    }
    
}
