import { Injectable } from "@nestjs/common";
import { RefreshToken } from "@prisma/client";
import { RefreshTokenEntity } from "src/core/entities/refreshToken.entity";
import { PrismaService } from "src/database/dataBase.service";

@Injectable()
export class RefreshTokenRepository {
    constructor(private readonly prisma: PrismaService){}

    async findByToken(tokenId: string):Promise<RefreshTokenEntity | null>{
        const token = await this.prisma.refreshToken.findUnique({
            where:{
                token: tokenId
            }
        })
        if(!token) return null;
        return this.refreshTokenMapper(token)
    }

    async findByUserId(userId: string): Promise<RefreshTokenEntity | null>{
        const token = await this.prisma.refreshToken.findUnique({
            where:{
                userId:userId
            }
        })
        if(!token) return null;
        return this.refreshTokenMapper(token)
    }

    async update(token: RefreshTokenEntity): Promise<RefreshTokenEntity>{
        const updatedToken = await this.prisma.refreshToken.update({
            where:{ id: token.id },
            data:{
                expiresAt:token.expiresAt,
                revokedAt:token.revokedAt,
            }
        })
        return RefreshTokenEntity.formDate(updatedToken)
    }

    refreshTokenMapper(token: RefreshToken): RefreshTokenEntity {
        return RefreshTokenEntity.formDate(token);
    }

    async deleteRefreshTokenByUserId(userId: string){
        await this.prisma.refreshToken.deleteMany({
            where:{
                userId: userId
            }
        }

        )
    }

    async createRefreshToken(refreshToken: RefreshTokenEntity):Promise<RefreshTokenEntity>{
        const refreshTokenCreated = await this.prisma.refreshToken.create({
            data:{
                id: refreshToken.id,
                token: refreshToken.token,
                userId: refreshToken.userId.getValue(),
                expiresAt: refreshToken.expiresAt,
                createdAt: refreshToken.createdAt,
            }
        })
        return RefreshTokenEntity.formDate(refreshTokenCreated)
    }
}