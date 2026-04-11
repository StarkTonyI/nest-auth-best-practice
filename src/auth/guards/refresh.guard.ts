import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Request } from "express";
import { REQ, TOKEN } from "../enums/auth.enum";
import { LoggerService } from "src/services/logger.service";
@Injectable()
export class RefreshJwtGuard implements CanActivate{
    constructor(
        private readonly logger: LoggerService
    ){}

    async canActivate(context: ExecutionContext) {
        const methods = { method: "Refresh token", module:"Refresh guard" };
        const req = context.switchToHttp().getRequest() as Request;

        const token = req.cookies?.refreshToken
        if(!token) { 
            this.logger.log("Cookies is not exist", methods)
            throw new UnauthorizedException;
        }
        req[REQ.rawRefresh] = token;

        return true;
            

    }
}







