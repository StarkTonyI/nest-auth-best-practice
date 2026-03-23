import { CommandBus } from "@nestjs/cqrs";
import { AuthDomainService } from "../domains/auth.domain";
import RegisterUserDto from "./dto/registerUser.dto";
import { CommandCreateAuthEvent } from "./handler/events/create-auth.events";
import { ConflictException, Inject, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { type IAuthRepository } from "../interfaces/repository/auth-repository";
import { JwtService } from "@nestjs/jwt";
import { SafeUser } from "src/types/prisma-user";
import * as bcrypt from 'bcrypt'
import { ApiConfigServices } from "src/configService/apiConfig.service";
import { LoggerService } from "../services/logger.service";
import { AsyncSubject } from "rxjs";
import LoginUserDto from "./dto/loginUser.dro";
import { ProfileRepository } from "src/infrastructure/repository/profile-repository.service";
import { Request, Response } from "express";
import { JwtPayload } from "src/interfaces/jwtPayload.interface";
@Injectable()
export class AuthService {
    constructor(
        private readonly authDomain: AuthDomainService,
        private readonly commandBus: CommandBus,
        @Inject('IAuthRepository')
        private readonly authRepo: IAuthRepository,
        @Inject('IProfileRepository')
        private readonly profileRepo: ProfileRepository,
        private readonly jwt: JwtService,
        private readonly config: ApiConfigServices,
        private readonly logger: LoggerService
    ){}


    async register(payload: RegisterUserDto, res: Response){
        const context = { method: "register", module: "AuthService" }
        const { email, password } = payload;
    
        this.authDomain.isUserCorrect(email, password);
        await this.commandBus.execute(new CommandCreateAuthEvent(payload))
        const user = await this.authRepo.findByEmail(email)
        if(!user){
            this.logger.log(`Something get wrong, user not created or exist, with email: ${email}`, context)
            throw new Error("User not found after creation!")
        }
        const { access_token, refresh_token } = await this.generatedTokens(user);
        const hashedRefreshToken = await bcrypt.hash(refresh_token, 10);
        try {
            await this.authRepo.update(user.id, { refreshToken: hashedRefreshToken, revoked: false })
            this.logger.log(`Assign token succesfull for id: ${user.id}`)
        }catch(err){
            this.logger.log(`Cannot assign tokens for id: ${user.id}`)
            throw new Error('Cannot add token')
        }
        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,     // JS не сможет прочитать куку (защита от XSS)
            secure: true,       // Только через HTTPS (в деве можно false)
            sameSite: 'lax',    // Защита от CSRF
            maxAge: 30 * 24 * 60 * 60 * 1000, // Срок жизни (например, 30 дней)
  });
        return {
            access_token, refresh_token, ...user 
        }
    }

    async login(payload: LoginUserDto, res:Response){
        const { email, password } = payload;

        this.logger.log("Started login.. ")
        this.authDomain.isUserCorrect(email, password)

        const userExist = await this.authRepo.findByEmail(email, true);
        if(!userExist) throw new NotFoundException("User is not exist");

        if('password' in userExist){
            console.log(password)
            console.log(userExist.password)
            const ismathch = await bcrypt.compare(password, userExist.password);
            if(!ismathch) throw new UnauthorizedException('Invalid email or password');
        }else throw new Error('Unexpected user type: no password');

        const profile = await this.profileRepo.findByAuthId(userExist.id);

        if(!profile){
            this.logger.log(`Profile dont exist with authId: ${userExist.id}`)
            throw new NotFoundException("Profile is not exist")
        }
        const { access_token, refresh_token } = await this.generatedTokens(userExist);
        const hashedRefreshToken = await bcrypt.hash(refresh_token, 10)

        await this.authRepo.update(userExist.id, { refreshToken: hashedRefreshToken, revoked:false })

        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,     // JS не сможет прочитать куку (защита от XSS)
            secure: true,       // Только через HTTPS (в деве можно false)
            sameSite: 'lax',    // Защита от CSRF
            maxAge: 30 * 24 * 60 * 60 * 1000, // Срок жизни (например, 30 дней)
  });
        
        return {
                id: userExist.id, 
                access_token,
                refresh_token,
                profile: {
                profileId: profile.id,
                profileLastname: profile.lastname,
            }
        }
    }
    
    async generatedTokens(auth: SafeUser){
        const payload = { id: auth.id, username: auth.username, email: auth.email }
        return {
            access_token: await this.jwt.signAsync(payload),
            refresh_token: await this.jwt.signAsync(payload, {
            expiresIn: this.config.authConfigRefresh.jwtExpirationTime, secret: this.config.authConfigRefresh.jwtSecret
            })
        }
    }

    async refreshToken(user: SafeUser, refreshToken: string){
        const context = { module: 'AuthService', method: 'refreshToken' };
        this.logger.log("Refresh logger started..", context);
     
        console.log(refreshToken)
        console.log(user.refreshToken)

        const compare = await bcrypt.compare(refreshToken, user.refreshToken)

        if(!compare){
            this.logger.log("Tokens incorrect", context)
             throw new UnauthorizedException("Cant Refresh token");
        }

        const { access_token, refresh_token } = await this.generatedTokens(user)

        const hashedRefreshToken = await bcrypt.hash(refresh_token, 10)
        await this.authRepo.update(user.id, { refreshToken: hashedRefreshToken, revoked: false })

        this.logger.log(`Refresh token succesully ended for email: ${user.email} `, context)
        return {
            access_token, 
            refresh_token
        }
    }

}









