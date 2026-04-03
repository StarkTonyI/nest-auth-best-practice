import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { AuthDomainService } from "src/domains/auth.domain";
import { JwtPayload } from "src/interfaces/jwtPayload.interface";
import { ApiConfigServices } from "src/configService/apiConfig.service";
import { Request } from "express";
import { UserRepository } from "src/infrastructure/repository/user-repository.service";
import { REQ, TOKEN } from "../enums/auth.enum";
import { LoggerService } from "src/services/logger.service";
@Injectable()
export class RefreshJwtGuard implements CanActivate{
    constructor(
        private readonly jwt: JwtService,
        private readonly config: ApiConfigServices,
        @Inject('IUserRepository')
        private readonly authRepo: UserRepository,
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

            req[REQ.user] = user;
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







