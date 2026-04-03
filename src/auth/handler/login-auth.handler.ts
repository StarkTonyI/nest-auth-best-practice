import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { LoginEvent } from "./events/login-auth.event";
import { LoggerService } from "src/services/logger.service";
import { UserService } from "src/services/userServices.service";
import { ProfileService } from "src/profile/profile.service";
import { TokenProvide } from "../providers/token.provide";

@CommandHandler(LoginEvent)
export class LoginHandler implements ICommandHandler<LoginEvent>{
    constructor(private readonly logger: LoggerService, private readonly userService: UserService, private readonly profileService: ProfileService, 
    private readonly tokenProvider: TokenProvide){};
    async execute(command: LoginEvent) {
        const { login } = command;
        const { email, password } = login;
        
        this.logger.log("Started login.. ")

        const userValidate = await this.userService.validateUser(email, password)
        
        await this.profileService.validateProfile(userValidate.userId)
    
        const { access_token, refresh_token } = this.tokenProvider.generatedTokens(userValidate)
        
        this.logger.log("Login ended!");
        
        return {
            id: userValidate.userId.getValue(), 
            access_token,
            refresh_token,
                        
        }

    }

}