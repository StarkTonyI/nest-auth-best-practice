import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Role } from "@prisma/client";
import { ApiConfigServices } from "src/configService/apiConfig.service";
import { User } from "src/core/entities/user.entity";
import { uuid } from "uuidv4";
import { AuthService } from "../auth.service";
import { UserId } from "src/value-objects/userid.vo";

interface JwtPayload {
    userId: string,
    email: string,
    role: Role
}
@Injectable()
export class TokenProvide {
    constructor(private readonly jwt: JwtService, private configService: ApiConfigServices, private readonly authService: AuthService){}

    buildPayload(user: User){
        const payload = {
            userId: user.userId.getValue(),
            email: user.userEmail.getValue(),
            role: user.userRole,
        }
        return payload
    }

    accessToken(payload:JwtPayload){
        return this.jwt.sign(payload, {
            secret: this.configService.authConfig.jwtSecret,
            expiresIn: this.configService.authConfig.jwtExpirationTime
        })
    }

    async refreshToken(userId: UserId){
        const refreshToken = uuid();
        await this.authService.createRefreshToken(userId, refreshToken)
        return refreshToken;
    }

    generatedTokens(user: User){
        
        const payload = this.buildPayload(user)
        const access_token = this.accessToken(payload);
        const refresh_token = this.refreshToken(user.userId)
        
        return {
            access_token, refresh_token
        }

    }
}