import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { RefreshTokenEvent } from "./events/refresh-token.event";
import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { LoggerService } from "src/services/logger.service";
import { IdentityService } from "../identity.service";
import { UserRepository } from "src/infrastructure/repository/identity-repository.service";
import { JwtService } from "@nestjs/jwt";
import { ApiConfigServices } from "src/configService/apiConfig.service";
import { uuid } from "uuidv4";
@Injectable()
@CommandHandler(RefreshTokenEvent)
export class RefreshTokenCommandHandler implements ICommandHandler<RefreshTokenEvent>{
    constructor(
        private readonly logger: LoggerService, 
        private readonly identityService: IdentityService, 
        @Inject("IUserRepository")
        private readonly authRepository: UserRepository, 
        private readonly jwt: JwtService,
        private readonly configService: ApiConfigServices
    ){}
    async execute(command: RefreshTokenEvent) {
        const context = { module:'RefreshTokenHandler', method: 'Refresh token' }
        const { refreshToken } = command;
        this.logger.log("Started refresh token", context)

        const token = await this.identityService.validatoinRefreshToken(refreshToken)

        if(!token){
            throw new UnauthorizedException;
        }

        const user = await this.authRepository.findById(token.userId.getValue())

        if(!user){
            throw new UnauthorizedException;
        }

        await this.identityService.revokeRefreshToken(refreshToken)

        const payload = {
            userId: user.userId.getValue(),
            email: user.userEmail,
            role: user.userRole,
        }

         const access_token = this.jwt.sign(payload, {
            secret: this.configService.authConfig.jwtSecret,
            expiresIn: this.configService.authConfig.jwtExpirationTime
         })

         const refresh_token = uuid();

         await this.identityService.createRefreshToken(user.userId, refreshToken)

        return { access_token, refresh_token };
    }
}




