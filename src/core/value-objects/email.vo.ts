import { InvalidInputException } from "src/core/exeption/domain-exeptions";

export class Email {
    private readonly _email: string;
    constructor(email: string){
        if(!this.isValid(email)){
            throw new InvalidInputException("Email form incorrect")
        }
        this._email = email;
    }

    private isValid(email: string): boolean {
    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailRegex.test(email);
  }

  get value():string {
    return this._email;
  }
  equals(value: string): boolean{
    return this._email === value
  }
}