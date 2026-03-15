import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { AuthDomainService } from "src/auth/domains/auth.domain";
import { JwtPayload } from "src/auth/domains/interfaces/jwtPayload.interface";
import { ApiConfigServices } from "src/configService/apiConfig.service";
import { ExtractJwt } from "passport-jwt";
import { Request } from "express";
@Injectable()
export class JwtStrategy implements CanActivate{
    constructor(
        private readonly jwt: JwtService,
        private readonly reflector: Reflector,
        private readonly config: ApiConfigServices,
        private readonly domain: AuthDomainService,
    ){}

    jwtFromReques(req: Request){
        const authHeader = req.headers.authorization;
        if(authHeader && authHeader.startsWith('Bearer ')){
           return authHeader.split(' ')[1]
        }
        return undefined;
    }

    async canActivate(context: ExecutionContext) {
        const req = context.switchToHttp().getRequest();
        const reflector = this.reflector.getAllAndOverride("tokenType", [context.getClass(), context.getHandler()]) || 'access';
        const secret = reflector === 'access' ? this.config.authConfig.jwtSecret : this.config.authConfigRefresh.jwtSecret;
        const token = this.jwtFromReques(req);
        if(!token) throw new UnauthorizedException('No token');

        try{
            const payloadJwt = await this.jwt.verifyAsync(token, {
                secret: secret, 
            }) as JwtPayload;
            this.domain.isJwtPayloadValid(payloadJwt);
            req['user'] = payloadJwt as JwtPayload;
            return true;
            
        }catch(err){
            if(err.name === 'TokenExpiredError'){
                throw new UnauthorizedException('TokenExpired')
            }
            throw new UnauthorizedException("Invalid token")
        }
    }
}







