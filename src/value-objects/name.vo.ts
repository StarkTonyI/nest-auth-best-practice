import { randomBytes } from "crypto";

export class Name {
    private readonly value: string
    constructor(value: string){
        if(!this.isValid(value)){
            throw new Error('Incorrect name')
        }
        this.value = this.formatName(value);
    }

    private isValid(value: string): boolean{
        return !!value && value.trim().length > 0 && value.trim().length < 24;
    }  

    private formatName(value: string): string{
        return value.trim()
    }

    getValue():string{
        return this.value;
    }

    equals(value: string): boolean{
        return value.trim() === this.getValue()
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
    private readonly firstName: FirstName;
    private readonly lastName: LastName;
    constructor(firstName: FirstName, lastName: LastName){
        this.firstName = firstName,
        this.lastName = lastName
    }
    getFirstName(): FirstName{
        return this.firstName;
    }

    getLastName(): LastName{
        return this.lastName;
    }

    getFullName(): string{
        return `${this.firstName.getValue()} ${this.lastName.getValue()}`
    }
}