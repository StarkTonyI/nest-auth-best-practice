import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ApiConfigServices } from "src/configService/apiConfig.service";
import { UserId } from "src/value-objects/userid.vo";
import { uuid } from "uuidv4";
import { Session } from "src/core/entities/session.entity";
import { SessionRepository } from "src/infrastructure/repository/session-repository.service";
import { LoggerService } from "src/services/logger.service";
import { Identity } from "src/core/entities/Identity.entity";
import { Email } from "src/value-objects/email.vo";

interface JwtPayload {
    userId: string,
    email: string,
}

@Injectable()
export class SessionService {
    constructor(
        private readonly jwt: JwtService,
        private configService: ApiConfigServices,
        private readonly sessionRepository: SessionRepository,
        private readonly logger: LoggerService
    ){}

    async validatoinRefreshToken(token: string): Promise<Session>{
        this.logger.log("Started token validatoin...");
     
        const findToken = await this.sessionRepository.findByToken(token)
        if(!findToken){
            this.logger.warn("Token is not exist in base");
            throw new UnauthorizedException;
        }

        if(findToken.isExpired()){
            this.logger.warn("Token already expired");
            throw new UnauthorizedException;
        }

        return findToken;

    }

    async revokeRefreshToken(refreshToken: string){
        const token = await this.sessionRepository.findByToken(refreshToken);
        if(!token){
            this.logger.warn("Cant revoke. Token is not exist in base");
            throw new UnauthorizedException;
        }
        //await this.sessionRepository.update(token)
    }

    async createRefreshToken(userId: UserId, hashedToken: string){
        await this.sessionRepository.deleteRefreshTokenByUserId(userId.getValue());

        const sessionValidate = new Session({ identityId: userId, hashedToken, 
        expirationDays: this.configService.authConfigRefresh.jwtExpirationTime  })

        await this.sessionRepository.createRefreshToken(sessionValidate)

    }

    async refreshToken(userId: UserId):Promise<string>{
        const refreshToken = uuid();
        await this.createRefreshToken(userId, refreshToken)
        return refreshToken;
    }

    buildPayload(userId: UserId, email: Email){
        const payload = {
            userId: userId.getValue(),
            email: email.getValue(),
        }
        return payload
    }

    accessToken(payload:JwtPayload){
        return this.jwt.sign(payload, {
            secret: this.configService.authConfig.jwtSecret,
            expiresIn: this.configService.authConfig.jwtExpirationTime
        })

    }

    async generatedTokens(userId: UserId, email: Email){
        const payload = this.buildPayload(userId, email)
        const access_token = this.accessToken(payload);
        const refresh_token = await this.refreshToken(userId)

        return {
            access_token, refresh_token
        }
    }
}

