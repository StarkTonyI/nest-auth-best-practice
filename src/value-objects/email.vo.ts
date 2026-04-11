export class Email {
    private readonly email: string;
    constructor(email: string){
        if(!this.isValid(email)){
            throw new Error("Email form incorrect")
        }
        this.email = email;
    }

    private isValid(email: string): boolean {
    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailRegex.test(email);
  }

  get getValue():string {
    return this.email;
  }
  equals(value: string): boolean{
    return this.email === value
  }
}