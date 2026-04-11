import { v4 as uuidv4 } from 'uuid';

export abstract class EntityId {
    public value: string
    constructor(value:string){
        
     
        this.value = value
    }

    get getValue(): string{
        return this.value;
    }

    equals(otherId: string): boolean{
           /*
        if(!value && value.trim().length < 12){
            throw new Error(`${this.constructor.name} cannot have such id!` )
        }
            */
        return otherId === this.value;
    }

    protected static generatedId(){
        return uuidv4();
    }

}