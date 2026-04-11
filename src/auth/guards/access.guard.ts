import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { JwtPayload } from "src/interfaces/jwtPayload.interface";
import { ApiConfigServices } from "src/configService/apiConfig.service";
import { Request } from "express";
import { REQ } from "../enums/auth.enum";
import { LoggerService } from "src/services/logger.service";
import { error } from "console";
@Injectable()
export class AccessJwtGuard implements CanActivate{
    constructor(
        private readonly jwt: JwtService,
        private readonly config: ApiConfigServices,
        private readonly logger: LoggerService,
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
            

            if(!payloadJwt.userId){
                this.logger.warn("Invalid payload", methods)
                throw new UnauthorizedException;
            }
            req[REQ.user] = payloadJwt;

            return true;
            
        }catch(error){
            if(error instanceof Error && error.name === 'TokenExpiredError'){
                throw new UnauthorizedException('TokenExpired')
            }
            throw new UnauthorizedException("Invalid token")
        }
    }
}







