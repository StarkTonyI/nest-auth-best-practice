import { v4 as uuidv4 } from 'uuid';

export abstract class EntityId {
    private readonly value: string
    constructor(value:string){
        if(!value && value.trim().length < 12){
            throw new Error(`${this.constructor.name} cannot have such id!` )
        }
        this.value = value
    }

    get getValue(): string{
        return this.value;
    }

    equals(otherId: string): boolean{
        return otherId === this.value;
    }

    protected static generatedId(){
        return uuidv4();
    }

}