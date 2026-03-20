import { CommandBus } from "@nestjs/cqrs";
import { AuthDomainService } from "../domains/auth.domain";
import RegisterUserDto from "./dto/registerUser.dto";
import { CommandCreateAuthEvent } from "./handler/events/create-auth.events";
import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { type IAuthRepository } from "../interfaces/repository/auth-repository";
import { JwtService } from "@nestjs/jwt";
import { SafeUser } from "src/types/prisma-user";
import * as bcrypt from 'bcrypt'
import { ApiConfigServices } from "src/configService/apiConfig.service";
import { LoggerService } from "./services/logger.service";
@Injectable()
export class AuthService {
    constructor(
        private readonly authDomain: AuthDomainService,
        private readonly commandBus: CommandBus,
        @Inject('IAuthRepository')
        private readonly authRepo: IAuthRepository,
        private readonly jwt: JwtService,
        private readonly config: ApiConfigServices,
        private readonly logger: LoggerService
    ){}


    async register(payload: RegisterUserDto){
        const context = { method: "register", module: "AuthService" }
        const { email, password } = payload;
    
        this.authDomain.isUserCorrect(email, password);
        await this.commandBus.execute(new CommandCreateAuthEvent(payload))
        const user = await this.authRepo.findByEmail(email)
        if(!user){
            this.logger.log(`Something get wrong, user not created or exist, with email: ${email}`, context)
            throw new Error("User not found after creation!")
        }
        const { acess_token, refresh_token } = await this.generatedTokend(user);
        const hashedRefreshToken = await bcrypt.hash(refresh_token, 10);
        try {
            await this.authRepo.update(user.id, { refreshToken: hashedRefreshToken, revoked: false })
            this.logger.log(`Assign token succesfull for id: ${user.id}`)
        }catch(err){
            this.logger.log(`Cannot assign tokens for id: ${user.id}`)
            throw new Error('Cannot add token')
        }
        return {
            acess_token, refresh_token, ...user 
        }
    }

    async generatedTokend(auth: SafeUser){
        const payload = { id: auth.id, username: auth.username, email: auth.email }
        return {
            acess_token: await this.jwt.signAsync(payload),
            refresh_token: await this.jwt.signAsync(payload, {
            expiresIn: this.config.authConfigRefresh.jwtExpirationTime, secret: this.config.authConfigRefresh.jwtSecret
            })
        }
    }
}




