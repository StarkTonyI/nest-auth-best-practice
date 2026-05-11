import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { PrismaModule } from "../../../infrastructure/database/dataBase.module";
import { ConfigModule } from "@nestjs/config";
import { ApiConfigModule } from "../../../infrastructure/services/configService/apiConfig.module"; // Проверь путь
import { CqrsModule } from "@nestjs/cqrs";
import { IdentityRepository } from "../../../infrastructure/repository/identity-repository.service";
import { JwtModule } from "@nestjs/jwt";
import { ApiConfigServices } from "src/infrastructure/services/configService/apiConfig.service";
import { ProfileRepository } from "src/infrastructure/repository/profile-repository.service";
import { AccessJwtGuard } from "../../guards/access.guard";
import { RefreshJwtGuard } from "../../guards/refresh.guard";
import { SessionRepository } from "src/infrastructure/repository/session-repository.service";
import { HasherService } from "../../../infrastructure/services/hasherSerive/hasherService.service";
import { TokenService } from "../../../infrastructure/services/tokenSerice/tokenService.service";
import { LoginCommandHandler } from "../../../application/commands/auth/login-auth.handler";
import { RefreshTokenCommandHandler } from "../../../application/commands/auth/session.handler";
import { AssingPermissionHandler } from "../../../application/commands/role/assign-permission.handler";
import { RegisterCommandHandler } from "src/application/commands/auth/regiser-auth.handler";
import RoleModule from "../role/role.module";
import { LogoutAuthHandler } from "src/application/commands/auth/logout-auth.hander";
@Module({
    imports: [
        CqrsModule,
        PrismaModule, 
        ConfigModule, 
        ApiConfigModule,
        RoleModule,
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
        RegisterCommandHandler,
        LoginCommandHandler, RefreshTokenCommandHandler, HasherService, TokenService, LogoutAuthHandler,
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
        },
        AccessJwtGuard, 
        RefreshJwtGuard
    ], exports: ['iIdentityRepository','iSessionRepository','iProfileRepository']

})
export class AuthModule {}






