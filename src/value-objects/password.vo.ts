import { InvalidInputException } from "src/exeption/domain-exeptions";

export class Password {
    private readonly password: string
    constructor(password: string){
        if(!this.isValid(password)) {
            throw new InvalidInputException("Password wrong")
        }
        this.password = password;
    }
  private isValid(password: string): boolean {
    // The Password must be at least 8 characters long and include at least one uppercase letter,
    // one lowercase letter, one number, and one special character
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>_])[A-Za-z\d!@#$%^&*(),.?":{}|<>_]{8,}$/;

    return passwordRegex.test(password);
  }

  get getValue(): string{
    return this.password;
  }




}