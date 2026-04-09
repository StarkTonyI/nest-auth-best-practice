import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { LoginEvent } from "./events/login-auth.event";
import { LoggerService } from "src/services/logger.service";
import { Inject, Injectable } from "@nestjs/common";
import { Email } from "src/value-objects/email.vo";
import { Password } from "src/value-objects/password.vo";
import { TokenService } from "../services/TokenService.service";
import { type IdentityRepository } from "src/interfaces/repository/identity-repository";
import { passwordHash } from "../services/passwordHash.service";
import { SessionRepository } from "src/infrastructure/repository/session-repository.service";

@Injectable()
@CommandHandler(LoginEvent)
export class LoginCommandHandler implements ICommandHandler<LoginEvent>{
    constructor(
        private readonly logger: LoggerService, 
        private readonly tokenService: TokenService, 
        @Inject("iIdentityRepository")
        private readonly identityRepository: IdentityRepository,
        @Inject("ISessionRepository")
        private readonly sessoinRepository: SessionRepository,
        private readonly passwordHash: passwordHash, 
    ){};
    async execute(command: LoginEvent) {
        const { login } = command;
        
        this.logger.log("Started login process for email: " + login.email);

        try {
            const email = new Email(login.email);
            const password = new Password(login.password);

            this.logger.log("Validating user credentials");
            const findUser = await this.identityRepository.findByEmail(email.getValue(), {});
            
            if (!findUser) {
                this.logger.warn("User not found for email: " + login.email);
                throw new Error("User does not exist");
            }

            this.logger.log("Comparing passwords for user: " + findUser.userId);
            const passwordCompare = await this.passwordHash.compare(password.getValue, findUser.userPasswordHash);
            
            if (!passwordCompare) {
                this.logger.warn("Invalid password attempt for user: " + findUser.userId);
                throw new Error("Incorrect login or password");
            }

            this.logger.log("Generating tokens for user: " + findUser.userId);
            const { access_token, refresh_token, expiresIn } = await this.tokenService.generatedTokens(findUser.userId, findUser.userEmail);
            
            this.logger.log("Creating session for user: " + findUser.userId);
            const session = findUser.createNewSession(refresh_token, expiresIn);
            
            await this.sessoinRepository.createSession(session);

            this.logger.log("Login completed successfully for user: " + findUser.userId);
            
            return {
                id: findUser.userId.getValue(),
                access_token,
                refresh_token,
            };
        } catch (error) {
            this.logger.error("Login failed: " + error.message);
            throw error;
        }
    }

}
