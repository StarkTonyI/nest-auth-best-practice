import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Request } from "express";
import { REQ } from "../enums/auth.enum";
import { AuthenticationException } from "src/exeption/domain-exeptions";
@Injectable()
export class RefreshJwtGuard implements CanActivate{
    constructor(){}

    async canActivate(context: ExecutionContext) {
        const methods = { method: "Refresh token", module:"Refresh guard" };
        const req = context.switchToHttp().getRequest() as Request;

        const token = req.cookies?.refreshToken
        if(!token) { 
            throw new AuthenticationException("Token is not exist or invalid!", { reason: "There is no token in the cookie.", entityId:"" });
        }
        req[REQ.rawRefresh] = token;

        return true;
            

    }
}







