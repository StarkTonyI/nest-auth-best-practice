import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { LoginEvent } from "./impl/login-auth.command";
import { LoggerService } from "src/services/logger.service";
import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { Email } from "src/value-objects/email.vo";
import { Password } from "src/value-objects/password.vo";
import { type iIdentityRepository } from "src/interfaces/repository/identity-repository";
import { type iSessionRepository } from "src/interfaces/repository/sessoin-repository";
import { AuthenticationException, EntityNotFoundException } from "src/exeption/domain-exeptions";
import e from "express";
import { HasherService } from "src/auth/services/HasherService.service";
import { TokenService } from "src/auth/services/TokenService.service";

@Injectable()
@CommandHandler(LoginEvent)
export class LoginCommandHandler implements ICommandHandler<LoginEvent>{
    constructor(
        private readonly logger: LoggerService, 
        private readonly tokenService: TokenService, 
        @Inject("iIdentityRepository")
        private readonly identityRepository: iIdentityRepository,
        @Inject("iSessionRepository")
        private readonly sessoinRepository: iSessionRepository,
        private readonly passwordHash: HasherService 
    ){};
    async execute(command: LoginEvent) {
        const { login } = command;
        try {
            
            const email = new Email(login.email);
            const password = new Password(login.password);

            const findUser = await this.identityRepository.findByEmail(email.value);
            
            if (!findUser) {
                throw new EntityNotFoundException("User", email.value);
            }

            const passwordCompare = await this.passwordHash.compare(password.value, findUser.getPasswordHash);
            
            if (!passwordCompare) {
                throw new AuthenticationException("Incorrect password", '');
            }
            const { access_token, refresh_token, expiresIn } = await this.tokenService.generatedTokens(findUser.getId, findUser.getEmail);
            
            const hashedToken = await this.passwordHash.hashToken(refresh_token)
            const session = findUser.createNewSession(hashedToken, expiresIn);
            
            await this.sessoinRepository.deleteSessionById(session.identityId.value)
            await this.sessoinRepository.createSession(session);

            
            return {
                id: findUser.getIdValue,
                access_token,
                refresh_token,
            };
            
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            this.logger.error("Login failed: " + message);
            throw error;
        }
    }

}
