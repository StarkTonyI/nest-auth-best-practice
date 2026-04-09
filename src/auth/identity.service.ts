import { LoggerService } from "../services/logger.service";
import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import RegisterUserDto from "src/dto/request/auth/registerUser.dto";
import { FirstName, LastName } from "src/value-objects/name.vo";
import { Email } from "src/value-objects/email.vo";
import { Password } from "src/value-objects/password.vo";
import { type IdentityRepository } from "src/interfaces/repository/identity-repository";
import * as bcrypt from 'bcrypt'
import { Identity } from "src/core/entities/Identity.entity";
import { Profile } from "src/core/entities/profile.entity";

@Injectable()

export class IdentityService {
    constructor(
        private readonly logger: LoggerService,
        @Inject('IUserRepository')
        private readonly entityRepository: IdentityRepository
    ){}

    
    async create(user: RegisterUserDto): Promise<Profile>{
        const firstName = new FirstName(user.firstName);
        const lastName = new LastName(user.lastName);
        const email = new Email(user.email);
        const password = new Password(user.password);

        const findUser = await this.entityRepository.findByEmail(email.getValue(), {})
        if(findUser){
            throw new Error("User already exist")
        }

        const passwordHash = await bcrypt.hash(password.getValue, 10)
      
        const validatedUser = Identity.create(email, passwordHash)

        await this.entityRepository.create(validatedUser);

        const validateProfile = Profile.create({ firstName, lastName, identityId: validatedUser.userId });
        
        validatedUser.addProfile(validateProfile)
        
        return validateProfile;
    }

    async validateUser(emailStr: string, passwordStr: string): Promise<Identity>{
        const email = new Email(emailStr);
        const password = new Password(passwordStr)

        const findUser = await this.entityRepository.findByEmail(email.getValue(), {});

        if(!findUser){
            throw new Error("User is not exist!")
        }

        const passwordEqual = this.comparePassword(password.getValue, findUser.userPasswordHash)
        if(!passwordEqual){
            throw new UnauthorizedException;
        }

        return findUser

    }

    comparePassword(loginPassword: string, hashPassword: string){
        return bcrypt.compare(loginPassword, hashPassword)
    }

    async isOldPasswordCorrect(userId: string, oldPassword: string){
        const baseOldPassword = this
    }
}



