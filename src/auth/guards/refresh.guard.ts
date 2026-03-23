import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { AuthDomainService } from "src/domains/auth.domain";
import { JwtPayload } from "src/interfaces/jwtPayload.interface";
import { ApiConfigServices } from "src/configService/apiConfig.service";
import { Request } from "express";
import { AuthRepository } from "src/infrastructure/repository/auth-repository.service";
import { SafeUser } from "src/types/prisma-user";
import { REQ, TOKEN } from "../enums/auth.enum";
import { LoggerService } from "src/services/logger.service";
@Injectable()
export class RefreshJwtGuard implements CanActivate{
    constructor(
        private readonly jwt: JwtService,
        private readonly config: ApiConfigServices,
        private readonly domain: AuthDomainService,
        @Inject('IAuthRepository')
        private readonly authRepo: AuthRepository,
        private readonly logger: LoggerService
    ){}

    async canActivate(context: ExecutionContext) {
        const methods = { method: "Refresh token", module:"Refresh guard" };
        const req = context.switchToHttp().getRequest() as Request;
        const secret = this.config.authConfigRefresh.jwtSecret;
     
        const token = req.cookies?.[TOKEN.refresh]
        if(!token) { 
            this.logger.log("Cookies is not exist", methods)
            throw new UnauthorizedException;
        }

        try{
            const payloadJwt = await this.jwt.verifyAsync(token, {
                secret: secret, 
            }) as JwtPayload;
            
            const user = await this.authRepo.findById(payloadJwt?.id);
            const domainResult = await this.domain.isJwtPayloadValid(payloadJwt, user);

            if(!domainResult.valid) { 
                this.logger.log(domainResult.reason, methods)
                throw new UnauthorizedException;
            };

            req[REQ.user] = user as SafeUser;
            req[REQ.rawRefresh] = token;

            return true;
            
        }catch(err){
            if(err.name === 'TokenExpiredError'){
                throw new UnauthorizedException('TokenExpired')
            }
            this.logger.log(err.message || 'Invalid token', methods)
            throw new UnauthorizedException("Invalid token")
        }
    }
}







