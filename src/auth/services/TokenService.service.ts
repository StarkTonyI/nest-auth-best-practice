
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ApiConfigServices } from "src/configService/apiConfig.service";
import { JwtPayload } from "src/interfaces/jwtPayload.interface";
import { Email } from "src/value-objects/email.vo";
import { UserId } from "src/value-objects/userid.vo";
import { v4 as uuidv4 } from 'uuid';
@Injectable()
export class TokenService {
    constructor(private readonly jwt: JwtService, private readonly configService: ApiConfigServices){}

    buildPayload(userId: UserId, email: Email){
        const payload = {
            userId: userId.getValue,
            email: email.getValue(),
        }
        return payload
    }

    accessToken(payload:JwtPayload){
        return this.jwt.sign(payload, {
            secret: this.configService.authConfig.jwtSecret,
            expiresIn: this.configService.authConfig.jwtExpirationTime
        })

    }

    async generatedTokens(userId: UserId, email: Email){
        const payload = this.buildPayload(userId, email)
        const access_token = this.accessToken(payload);
        const refresh_token = uuidv4();

        return {
            access_token, refresh_token, expiresIn: this.configService.authConfig.jwtExpirationTime
        }
    }
}