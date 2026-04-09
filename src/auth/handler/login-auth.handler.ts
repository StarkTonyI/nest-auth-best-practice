import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { LoginEvent } from "./events/login-auth.event";
import { LoggerService } from "src/services/logger.service";
import { Injectable } from "@nestjs/common";
import { Email } from "src/value-objects/email.vo";
import { Password } from "src/value-objects/password.vo";
import { SessionService } from "../sessions/session.service";
@Injectable()
@CommandHandler(LoginEvent)
export class LoginCommandHandler implements ICommandHandler<LoginEvent>{
    constructor(
        private readonly logger: LoggerService, 
        private readonly sessoin: SessionService
    ){};
    async execute(command: LoginEvent) {
        const { login } = command;
        const { email, password } = login;
        
        this.logger.log("Started login.. ")

        const emailValidated = new Email(email);
        const passwordValidated = new Password(password);

        
        



        const { access_token, refresh_token } = await this.sessoin.generatedTokens(userValidate)
        
        this.logger.log("Login ended!");
   
        return {
            id: userValidate.userId.getValue(), 
            access_token,
            refresh_token,
                        
        }

    }

}
