import { InvalidInputException } from 'src/core/exeption/domain-exeptions';
import { v4 as uuidv4 } from 'uuid';

export abstract class EntityId {
    public _value: string
    constructor(value:string){
        if(!value && value.trim().length < 12){
            throw new InvalidInputException(`${this.constructor.name} cannot have such id!` )
        }
        this._value = value
    }

    get value(): string{
        return this._value;
    }

    equals(otherId: string): boolean{
        return otherId === this.value;
    }

    protected static generatedId(){
        return uuidv4();
    }

}