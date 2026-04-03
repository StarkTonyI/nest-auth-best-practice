import { LoggerService } from "../services/logger.service";
import { RefreshTokenRepository } from "src/infrastructure/repository/refreshToken-repository.service";
import { RefreshTokenEntity } from "src/core/entities/refreshToken.entity";
import { UserId } from "src/value-objects/userid.vo";
import { Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()

export class AuthService {
    constructor(
        private readonly refreshRepository: RefreshTokenRepository,
        private readonly logger: LoggerService
    ){}
    async validatoinRefreshToken(token: string): Promise<RefreshTokenEntity>{
        this.logger.log("Started token validatoin...");
        console.log("token")
        console.log(token)
        const findToken = await this.refreshRepository.findByToken(token)
        if(!findToken){
            this.logger.warn("Token is not exist in base");
            throw new UnauthorizedException;
        }

        if(findToken.isRevoked()){
            this.logger.warn("Token revoked");
            throw new UnauthorizedException;
        }

        if(findToken.isExpired()){
            this.logger.warn("Token already expired");
            throw new UnauthorizedException;
        }

        
        return findToken;

    }

    async revokeRefreshToken(refreshToken: string){
        const token = await this.refreshRepository.findByToken(refreshToken);
        if(!token){
            this.logger.warn("Cant revoke. Token is not exist in base");
            throw new UnauthorizedException;
        }
        token.makeRevoke();

        await this.refreshRepository.update(token)
    }

    async createRefreshToken(userId: UserId, refreshToken: string){
        await this.refreshRepository.deleteRefreshTokenByUserId(userId.getValue());

        const refreshPayload = new RefreshTokenEntity(refreshToken, userId, 30)

        await this.refreshRepository.createRefreshToken(refreshPayload)

    }
    
}



