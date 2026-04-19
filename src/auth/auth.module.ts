import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { PrismaModule } from "../database/dataBase.module";
import { ConfigModule } from "@nestjs/config";
import { ApiConfigModule } from "../configService/apiConfig.module"; // Проверь путь
import { CqrsModule } from "@nestjs/cqrs";
import { IdentityRepository } from "../infrastructure/repository/identity-repository.service";
import { JwtModule } from "@nestjs/jwt";
import { ApiConfigServices } from "src/configService/apiConfig.service";
import { ProfileRepository } from "src/infrastructure/repository/profile-repository.service";
import { AccessJwtGuard } from "./guards/access.guard";
import { RefreshJwtGuard } from "./guards/refresh.guard";
import { SessionRepository } from "src/infrastructure/repository/session-repository.service";
import { HasherService } from "./services/HasherService.service";
import { TokenService } from "./services/TokenService.service";
import { RoleRepository } from "src/infrastructure/repository/role-repository.service";
import { CreateCommandHandler } from "./handler/auth/create-identity.handler";
import { LoginCommandHandler } from "./handler/auth/login-auth.handler";
import { RefreshTokenCommandHandler } from "./handler/auth/session.handler";
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
        CreateCommandHandler, 
        LoginCommandHandler, RefreshTokenCommandHandler, HasherService, TokenService,
        {
            provide: 'iIdentityRepository',
            useClass: IdentityRepository
        }, 
        {
            provide: 'iSessionRepository',
            useClass: SessionRepository
        },
        {
            provide: 'iProfileRepository',
            useClass: ProfileRepository
        }, RoleRepository,
        AccessJwtGuard, 
        RefreshJwtGuard
    ], exports: ['iIdentityRepository','iSessionRepository','iProfileRepository']

})
export class AuthModule {}






