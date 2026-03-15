import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { PrismaModule } from "../database/dataBase.module";
import { ConfigModule } from "@nestjs/config";
import { ApiConfigModule } from "../configService/apiConfig.module"; // Проверь путь
import { AuthDomainService } from "./domains/auth.domain";
import { CreateCommandHandler } from "./handler/create-auth.handler";
import { CqrsModule } from "@nestjs/cqrs";
import { AuthRepository } from "./repository/auth-repository.service";
import { JwtModule } from "@nestjs/jwt";
import { ApiConfigServices } from "src/configService/apiConfig.service";
import { JwtGuard } from "./guards/jwt.guard";

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
    providers: [AuthService, AuthDomainService, CreateCommandHandler, 
        {
            provide: 'IAuthRepository',
            useClass: AuthRepository
        }, 
        JwtGuard
    ], exports: [AuthDomainService, 'IAuthRepository']

})
export class AuthModule {}






