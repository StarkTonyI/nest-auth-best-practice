import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { LoggerService } from "src/infrastructure/logger/logger.service";
import { Inject, Injectable } from "@nestjs/common";
import { Email } from "src/core/value-objects/email.vo";
import { Password } from "src/core/value-objects/password.vo";
import { type iIdentityRepository } from "src/core/repositories/identity-repository";
import { type iSessionRepository } from "src/core/repositories/sessoin-repository";
import { AuthenticationException, EntityNotFoundException } from "src/core/exeption/domain-exeptions";
import { HasherService } from "src/infrastructure/services/hasherSerive/hasherService.service";
import { TokenService } from "src/infrastructure/services/tokenSerice/tokenService.service";
import { LoginCommand } from "./impl/login-auth.command";

@Injectable()
@CommandHandler(LoginCommand)
export class LoginCommandHandler implements ICommandHandler<LoginCommand>{
    constructor(
        private readonly logger: LoggerService, 
        private readonly tokenService: TokenService, 
        @Inject("iIdentityRepository")
        private readonly identityRepository: iIdentityRepository,
        @Inject("iSessionRepository")
        private readonly sessoinRepository: iSessionRepository,
        private readonly passwordHash: HasherService 
    ){};
    async execute(command: LoginCommand) {
        const { login } = command;
        try {
            
            const email = new Email(login.email);
            const password = new Password(login.password);

            const findUser = await this.identityRepository.findByEmail(email.value);
            
            if (!findUser) {
                throw new EntityNotFoundException("User", email.value);
            }

            const passwordCompare = await this.passwordHash.compare(password.value, findUser.passwordHash);
            
            if (!passwordCompare) {
                throw new AuthenticationException("Incorrect password", '');
            }
            const { access_token, refresh_token, expiresIn } = await this.tokenService.generatedTokens(findUser.id, findUser.email);
            
            const hashedToken = await this.passwordHash.hashToken(refresh_token)
            const session = findUser.createNewSession(hashedToken, expiresIn);
            
            await this.sessoinRepository.deleteSessionById(session.identityId.value)
            await this.sessoinRepository.createSession(session);

            
            
            return {
                id: findUser.id.value,
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
