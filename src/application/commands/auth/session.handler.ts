import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { LoggerService } from "src/infrastructure/logger/logger.service";
import { type iSessionRepository } from "src/core/repositories/sessoin-repository";
import { type iIdentityRepository } from "src/core/repositories/identity-repository";
import { Session } from "src/core/entities/session.entity";
import { EntityNotFoundException } from "src/core/exeption/domain-exeptions";
import { TokenService } from "src/infrastructure/services/tokenSerice/tokenService.service";
import { HasherService } from "src/infrastructure/services/hasherSerive/hasherService.service";
import { RefreshTokenCommand } from "./impl/refresh-token.command";

@Injectable()
@CommandHandler(RefreshTokenCommand)
export class RefreshTokenCommandHandler implements ICommandHandler<RefreshTokenCommand>{
    constructor(
        private readonly logger: LoggerService, 
        @Inject("iSessionRepository")
        private readonly sessoinRepository: iSessionRepository,
        @Inject("iIdentityRepository")
        private readonly identityRepository: iIdentityRepository,
        private readonly tokenService: TokenService, 
        private readonly hasherService: HasherService

    ){}
    
    async execute(command: RefreshTokenCommand) {
        const context = { module: 'RefreshTokenHandler', method: 'execute' };
        const { refreshToken } = command;

        const hashedCookieToken = await this.hasherService.hashToken(refreshToken)
        const session = await this.sessoinRepository.findByToken(hashedCookieToken);

        if (!session) {
            throw new EntityNotFoundException("Session", refreshToken);
        }

        const identity = await this.identityRepository.findById(session.identityId.value);

        if (!identity) {
            this.logger.error(`User not found for identityId: ${session.identityId.value}`, context);
            throw new EntityNotFoundException("User", session.identityId.value);
        }

        const { access_token, refresh_token } = await this.tokenService.generatedTokens(identity.id, identity.email);

        const hashedToken = await this.hasherService.hashToken(refresh_token);
        const sessoinEntity = new Session({ hashedToken, identityId: identity.id });

        await this.sessoinRepository.deleteSessionById(session.identityId.value)
        await this.sessoinRepository.createSession(sessoinEntity);
    
        return { access_token, refresh_token };
    }
}





