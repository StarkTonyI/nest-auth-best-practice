import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { LoginEvent } from "./events/login-auth.event";
import { LoggerService } from "src/services/logger.service";
import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { Email } from "src/value-objects/email.vo";
import { Password } from "src/value-objects/password.vo";
import { TokenService } from "../services/TokenService.service";
import { type iIdentityRepository } from "src/interfaces/repository/identity-repository";
import { HasherService } from "../services/HasherService.service";
import { type iSessionRepository } from "src/interfaces/repository/sessoin-repository";
import { AuthenticationException, EntityNotFoundException } from "src/exeption/domain-exeptions";

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
        this.logger.log("Started login process for email: " + login.email);
        try {
            const email = new Email(login.email);
            const password = new Password(login.password);

            this.logger.log("Validating user credentials");
            const findUser = await this.identityRepository.findByEmail(email.getValue, { passwordHash: true });
            
            if (!findUser) {
                this.logger.warn("User not found for email: " + login.email);
                throw new EntityNotFoundException("User", { reason: "User is not exist in base", entityId: "", entity: email.getValue});
            }
            this.logger.log("Comparing passwords for user: " + findUser.userId);
            const passwordCompare = await this.passwordHash.compare(password.getValue, findUser.userPasswordHash);
            
            if (!passwordCompare) {
                this.logger.warn("Invalid password attempt for user: " + findUser.userId);
                throw new AuthenticationException("Incorrect password");
            }

            this.logger.log("Generating tokens for user: " + findUser.userId);
            const { access_token, refresh_token, expiresIn } = await this.tokenService.generatedTokens(findUser.userId, findUser.userEmail);
            
            this.logger.log("Creating session for user: " + findUser.userId);
            const hashedToken = await this.passwordHash.hashToken(refresh_token)
            const session = findUser.createNewSession(hashedToken, expiresIn);
            
            await this.sessoinRepository.deleteSessionById(session.identityId.getValue)
            await this.sessoinRepository.createSession(session);

            this.logger.log("Login completed successfully for user: " + findUser.userId);
            
            return {
                id: findUser.userId.getValue,
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
