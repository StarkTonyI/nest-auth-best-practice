import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { JwtPayload } from "src/shared/interfaces/jwtPayload.interface";
import { ApiConfigServices } from "src/infrastructure/services/configService/apiConfig.service";
import { Request } from "express";
import { REQ } from "../../shared/constants/auth.enum";
import { AuthenticationException } from "src/core/exeption/domain-exeptions";
@Injectable()
export class AccessJwtGuard implements CanActivate{
    constructor(
        private readonly jwt: JwtService,
        private readonly config: ApiConfigServices,
    ){}

    jwtFromRequest(req: Request){
        const authHeader = req.headers.authorization;
        if(authHeader && authHeader.startsWith('Bearer ')){
           return authHeader.split(' ')[1]
        }
        return undefined;
    }

    async canActivate(context: ExecutionContext) {
        const req = context.switchToHttp().getRequest() as Request;
        const secret = this.config.authConfig.jwtSecret;
     
        const token = this.jwtFromRequest(req);


        if(!token) {
            throw new AuthenticationException("Token invalid or not exist.", { reason: "Token is not exist in base", entityId:'' });
        }
        try{
            const payloadJwt = await this.jwt.verifyAsync(token, {
                secret: secret, 
            }) as JwtPayload;
            
            if(!payloadJwt.id){
                throw new AuthenticationException("Token invalid or not exist", { reason: "Invalid payload", entityId: ''});
            }
            req[REQ.user] = payloadJwt;

            return true;
            
        }catch(error){
            if(error instanceof Error && error.name === 'TokenExpiredError'){
                throw new AuthenticationException('TokenExpired', { reason: 'Token Expired', entityId:'' })
            }
            throw new AuthenticationException("Invalid token", { reason: "Invalid token", entityId:'' })
        }
    }
}







