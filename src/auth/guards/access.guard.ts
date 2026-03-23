import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { AuthDomainService } from "src/domains/auth.domain";
import { JwtPayload } from "src/interfaces/jwtPayload.interface";
import { ApiConfigServices } from "src/configService/apiConfig.service";
import { Request } from "express";
import { AuthRepository } from "src/infrastructure/repository/auth-repository.service";
import { SafeUser } from "src/types/prisma-user";
import { REQ } from "../enums/auth.enum";
import { LoggerService } from "src/services/logger.service";
@Injectable()
export class AccessJwtGuard implements CanActivate{
    constructor(
        private readonly jwt: JwtService,
        private readonly config: ApiConfigServices,
        private readonly domain: AuthDomainService,
        private readonly logger: LoggerService,
        @Inject('IAuthRepository')
        private readonly authRepo: AuthRepository
    ){}

    jwtFromRequest(req: Request){
        const authHeader = req.headers.authorization;
        if(authHeader && authHeader.startsWith('Bearer ')){
           return authHeader.split(' ')[1]
        }
        return undefined;
    }

    async canActivate(context: ExecutionContext) {
        const methods = { method: "Access token", module:"Access guard" };
        const req = context.switchToHttp().getRequest() as Request;
        const secret = this.config.authConfig.jwtSecret;
     
        const token = this.jwtFromRequest(req);
        if(!token) {
            this.logger.log("Token is not provided", methods)
            throw new UnauthorizedException;
        }

        try{
            const payloadJwt = await this.jwt.verifyAsync(token, {
                secret: secret, 
            }) as JwtPayload;
            

            if(!payloadJwt.id){
                this.logger.warn("Invalid payload", methods)
                throw new UnauthorizedException;
            }
            req[REQ.user] = payloadJwt;

            return true;
            
        }catch(err){
            if(err.name === 'TokenExpiredError'){
                throw new UnauthorizedException('TokenExpired')
            }
            throw new UnauthorizedException("Invalid token")
        }
    }
}







