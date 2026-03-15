import { Inject, Injectable } from "@nestjs/common";
import { JwtPayload } from "./interfaces/jwtPayload.interface";
import { JwtValidationResult } from "./interfaces/auth-domain.interface";
import { type IAuthRepositoryService } from "./interfaces/authRepository.interface";
@Injectable()
export class AuthDomainService {

    constructor(
      @Inject('IAuthRepositoryService')
      private readonly authRepo: IAuthRepositoryService
    ){}
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


async isJwtPayloadValid(payload: JwtPayload): Promise<JwtValidationResult> {

  const { id } = payload;

  if (!id) {
    return { valid:false, reason:'invalid-id' }
  }

  const user = await this.authRepo.findById(id);

  if (!user) {
    return { valid:false, reason:'invalid-user' }
  }

  if (user.revoked) {
    return { valid:false, reason:'revoked' }
  }

  return { valid:true }
}
}