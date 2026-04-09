import { Module } from "@nestjs/common";
import { AuthController } from "./identity.controller";
import { IdentityService } from "./identity.service";
import { PrismaModule } from "../database/dataBase.module";
import { ConfigModule } from "@nestjs/config";
import { ApiConfigModule } from "../configService/apiConfig.module"; // Проверь путь
import { AuthDomainService } from "../domains/auth.domain";
import { CreateCommandHandler } from "./handler/create-identity.handler";
import { CqrsModule } from "@nestjs/cqrs";
import { UserRepository } from "../infrastructure/repository/identity-repository.service";
import { JwtModule } from "@nestjs/jwt";
import { ApiConfigServices } from "src/configService/apiConfig.service";
import { ProfileRepository } from "src/infrastructure/repository/profile-repository.service";
import { AccessJwtGuard } from "./guards/access.guard";
import { RefreshJwtGuard } from "./guards/refresh.guard";
import { RefreshTokenRepository } from "src/infrastructure/repository/session-repository.service";
import { LoginCommandHandler } from "./handler/login-auth.handler";
import { RefreshTokenCommandHandler } from "./handler/session.handler";
import { ProfileService } from "src/profile/profile.service";
@Module({
    imports: [
        CqrsModule,
        PrismaModule, 
        ConfigModule, 
        ApiConfigModule,
        JwtModule.registerAsync({
            imports: [ApiConfigModule],
            useFactory:async (configService: ApiConfigServices)=>({
                secret: configService.authConfig.jwtSecret,
                signOptions: { expiresIn: configService.authConfig.jwtExpirationTime},
                
            }),
            inject:[ApiConfigServices]
        })
    ],
    controllers: [AuthController],
    providers: [
        AuthDomainService, CreateCommandHandler, 
        LoginCommandHandler, RefreshTokenCommandHandler,
        IdentityService, RefreshTokenRepository, ProfileService,
        {
            provide: 'IUserRepository',
            useClass: UserRepository
        }, 
        {
            provide: 'IProfileRepository',
            useClass: ProfileRepository
        }, 
        AccessJwtGuard, 
        RefreshJwtGuard
    ], exports: ['IUserRepository','IProfileRepository']

})
export class AuthModule {}






