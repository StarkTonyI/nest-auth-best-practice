import { Injectable } from "@nestjs/common";
import { JwtPayload } from "./interfaces/jwtPayload.interface";
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

  isUserNameValid(username: string){
    if(username.length < 8){
      return false
    }
    return true;
  }


  isJwtPayloadValid(payload: JwtPayload){
    const { email, username, id } = payload; 
    if(this.isEmailValid(email)) throw new Error('Payload incorrect email');
    if(this.isUserNameValid(username)) throw new Error('Payload username incorrect');
    if(!id) throw new Error('Id dont exist');
  }
}