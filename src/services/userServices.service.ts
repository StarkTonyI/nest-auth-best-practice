import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { User } from "src/core/entities/user.entity";
import RegisterUserDto from "src/dto/request/auth/registerUser.dto";
import { UserRepository } from "src/infrastructure/repository/user-repository.service";
import { Email } from "src/value-objects/email.vo";
import { FirstName, LastName } from "src/value-objects/name.vo";
import { Password } from "src/value-objects/password.vo";
import * as bcrypt from 'bcrypt'
import { UserId } from "src/value-objects/userid.vo";
@Injectable()
export class UserService {
    constructor(
        @Inject("IUserRepository")
        private readonly userRepository: UserRepository){};

    async create(user: RegisterUserDto){
        const userName = new FirstName(user.username);
        const lastName = new LastName(user.lastname);
        const email = new Email(user.email);
        const password = new Password(user.password);

        const findUser = await this.userRepository.findByEmail(email.getValue())
        if(findUser){
            throw new Error("User already exist")
        }

        const passwordHash = await bcrypt.hash(password.getValue, 10)
      

        const validatedUser = User.create(userName, lastName,passwordHash, email, user.role)

        const userCreated = await this.userRepository.create(validatedUser);
       
        return userCreated;
    }

    async validateUser(emailStr: string, passwordStr: string): Promise<User>{
        const email = new Email(emailStr);
        const password =new Password(passwordStr)

        const findUser = await this.userRepository.findByEmail(email.getValue());

        if(!findUser){
            throw new Error("User is not exist!")
        }

        const passwordEqual = this.comparePassword(password.getValue, findUser.userPasswordHash)
        if(!passwordEqual){
            throw new UnauthorizedException;
        }

        return findUser

    }

    updateUser(){

    }

    deleteUser(){

    }


    comparePassword(loginPassword: string, hashPassword: string){
        return bcrypt.compare(loginPassword, hashPassword)
    }




}

