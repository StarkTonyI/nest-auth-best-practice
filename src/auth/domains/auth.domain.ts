import { Injectable } from "@nestjs/common";

@Injectable()
export class AuthDomainService {
    constructor(){}
    isUserCorrect(email: string, password: string) {
        if(!this.isEmailValid(email)){
            throw new Error('Incorrect emaiL!')
        }
        if(!this.isPasswordValid(password)){
            throw new Error('Incorrect emaiL!')
        }
    }

  isPasswordValid(password: string): boolean {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  }

  isEmailValid(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

}