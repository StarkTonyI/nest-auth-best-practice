import { CommandBus } from "@nestjs/cqrs";
import { AuthDomainService } from "./domains/auth.domain";
import RegisterUserDto from "./dto/registerUser.dto";
import { CommandCreateAuthEvent } from "./handler/events/create-auth.events";
import { Inject, Injectable } from "@nestjs/common";
import { type IAuthRepositoryService } from "./domains/interfaces/authRepository.interface";
import { JwtService } from "@nestjs/jwt";
import { SafeUser } from "src/types/prisma-user";
import { bindCallback } from "rxjs";
import * as bcrypt from 'bcrypt'
import { ApiConfigServices } from "src/configService/apiConfig.service";
@Injectable()
export class AuthService {
    constructor(
        private readonly authDomain: AuthDomainService,
        private readonly commandBus: CommandBus,
        @Inject('IAuthRepository')
        private readonly authRepo: IAuthRepositoryService,
        private readonly jwt: JwtService,
        private readonly config: ApiConfigServices
    ){}


    async register(payload: RegisterUserDto){
        const { email, password, role, username } = payload;
    
        this.authDomain.isUserCorrect(email, password);
        await this.commandBus.execute(new CommandCreateAuthEvent(payload))
        const user = await this.authRepo.findByEmail(email)
        if(!user){
            throw new Error("User dont created!")
        }
        const { acess_token, refresh_token } = await this.generatedTokend(user);
        const hashedRefreshToken = await bcrypt.hash(refresh_token, 10);
        try {
            await this.authRepo.update(user.id, { refreshToken: hashedRefreshToken, revoked: false })
        }catch(err){
            throw new Error('Cannot update token')
        }

        return {
            data: {...user, acess_token, refresh_token}, 
        };
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

