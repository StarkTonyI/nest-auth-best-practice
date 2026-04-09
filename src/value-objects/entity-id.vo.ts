import { uuid } from "uuidv4";

export abstract class EntityId {
    private readonly value: string
    constructor(value:string){
        if(!value && value.trim().length < 12){
            throw new Error(`${this.constructor.name} cannot have such id!` )
        }
        this.value = value
    }

    getValue(): string{
        return this.value;
    }

    equals(otherId: string): boolean{
        return otherId === this.value;
    }

    protected static generatedId(){
        return uuid();
    }

}