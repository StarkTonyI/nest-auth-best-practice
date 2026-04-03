import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { PrismaModule } from "../database/dataBase.module";
import { ConfigModule } from "@nestjs/config";
import { ApiConfigModule } from "../configService/apiConfig.module"; // Проверь путь
import { AuthDomainService } from "../domains/auth.domain";
import { CreateCommandHandler } from "./handler/create-auth.handler";
import { CqrsModule } from "@nestjs/cqrs";
import { UserRepository } from "../infrastructure/repository/user-repository.service";
import { JwtModule } from "@nestjs/jwt";
import { ApiConfigServices } from "src/configService/apiConfig.service";
import { ProfileRepository } from "src/infrastructure/repository/profile-repository.service";
import { AccessJwtGuard } from "./guards/access.guard";
import { RefreshJwtGuard } from "./guards/refresh.guard";
import { RefreshTokenRepository } from "src/infrastructure/repository/refreshToken-repository.service";
import { UserService } from "src/services/userServices.service";
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
    providers: [AuthService, AuthDomainService, CreateCommandHandler, UserService,
        RefreshTokenRepository,
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






