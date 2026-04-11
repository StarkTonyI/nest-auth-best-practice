import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { RefreshTokenEvent } from "./events/refresh-token.event";
import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { LoggerService } from "src/services/logger.service";
import { type iSessionRepository } from "src/interfaces/repository/sessoin-repository";
import { type iIdentityRepository } from "src/interfaces/repository/identity-repository";
import { TokenService } from "../services/TokenService.service";
import { Session } from "src/core/entities/session.entity";
import { HasherService } from "../services/HasherService.service";

@Injectable()
@CommandHandler(RefreshTokenEvent)
export class RefreshTokenCommandHandler implements ICommandHandler<RefreshTokenEvent>{
    constructor(
        private readonly logger: LoggerService, 
        @Inject("iSessionRepository")
        private readonly sessoinRepository: iSessionRepository,
        @Inject("iIdentityRepository")
        private readonly identityRepository: iIdentityRepository,
        private readonly tokenService: TokenService, 
        private readonly hasherService: HasherService

    ){}
    
    async execute(command: RefreshTokenEvent) {
        const context = { module: 'RefreshTokenHandler', method: 'execute' };
        const { refreshToken } = command;
        
        this.logger.log("Started refresh token", context);

        const hashedCookieToken = await this.hasherService.hashToken(refreshToken)
        const session = await this.sessoinRepository.findByToken(hashedCookieToken);

        if (!session) {
            this.logger.error("Session not found for refresh token", context);
            throw new UnauthorizedException("Invalid refresh token");
        }
        this.logger.log(`Session found with identityId: ${session.identityId.getValue}`, context);

        const user = await this.identityRepository.findById(session.identityId.getValue, {});

        if (!user) {
            this.logger.error(`User not found for identityId: ${session.identityId.getValue}`, context);
            throw new UnauthorizedException("User not found");
        }

        this.logger.log(`User found: ${user.userEmail}`, context);

        const { access_token, refresh_token } = await this.tokenService.generatedTokens(user.userId, user.userEmail);
        this.logger.log("Tokens generated successfully", context);

        const hashedToken = await this.hasherService.hashToken(refresh_token);
        const sessoinEntity = new Session({ hashedToken, identityId: user.userId });

        await this.sessoinRepository.deleteSessionById(session.getIdentityId)
        await this.sessoinRepository.createSession(sessoinEntity);
    

        this.logger.log("Session saved successfully", context);
        return { access_token, refresh_token };
    }
}

