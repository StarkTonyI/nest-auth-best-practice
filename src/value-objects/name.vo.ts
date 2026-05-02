import { randomBytes } from "crypto";
import { InvalidInputException } from "src/exeption/domain-exeptions";

export class Name {
    private readonly _value: string
    constructor(value: string){
        if(!this.isValid(value)){
            throw new InvalidInputException(`Incorrect ${this.constructor.name}`)
        }
        this._value = this.formatName(value);
    }

    private isValid(value: string): boolean{
        return !!value && value.trim().length > 0 && value.trim().length < 24;
    }  

    private formatName(value: string): string{
        return value.trim()
    }

    get value():string{
        return this._value;
    }

    equals(value: string): boolean{
        return value.trim() === this.value
    }
}

export class UserName extends Name {
    constructor(userName?: string){
        super(userName || UserName.createUniqUserName(18))
    }
    static createUniqUserName(length: number){
        return `user-${randomBytes(length).toString('hex').slice(0, length)}`
    }
}

export class FirstName extends Name {
    constructor(firstName: string){
        super(firstName)
    }
}

export class LastName extends Name {
    constructor(lastName: string){
        super(lastName)
    }

}

export class FullName {
    private readonly _firstName: FirstName;
    private readonly _lastName: LastName;
    constructor(firstName: FirstName, lastName: LastName){
        this._firstName = firstName,
        this._lastName = lastName
    }
    get firstName(): FirstName{
        return this._firstName;
    }

    get lastName(): LastName{
        return this._lastName;
    }

    getFullName(): string{
        return `${this.firstName.value} ${this.lastName.value}`
    }
}