import { RefreshToken } from "@prisma/client";
import { IsRgbColor } from "class-validator";
import { UserId } from "src/value-objects/userid.vo";
import { uuid } from "uuidv4";

export class RefreshTokenEntity {
    id: string;
    token: string;
    userId: UserId;
    createdAt: Date;
    expiresAt: Date;
    revokedAt?: Date;

    constructor(token: string, userId:UserId, expirationDays: number, id?: string, createdAt?: Date){
        const now = new Date();
        this.id = id || uuid();
        this.token = token;
        this.userId = userId;
        this.expiresAt = new Date(now.getTime() + expirationDays * 24 * 60 * 60 * 1000);
        this.createdAt = createdAt || new Date();
    }

    static formDate(data: RefreshToken){
        return new RefreshTokenEntity(data.token, UserId.fromString(data.userId), 30, data.id, data.createdAt)
    }

    isRevoked(){
        return !!this.revokedAt
    }

    isExpired(){
        return new Date() > this.expiresAt;
    }

    makeRevoke(){
        this.revokedAt = new Date()
    }
}