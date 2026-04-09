import { Injectable } from "@nestjs/common";
import { Session as PrismaSession } from "@prisma/client";
import { Session } from "src/core/entities/session.entity";
import { PrismaService } from "src/database/dataBase.service";
import { UserId } from "src/value-objects/userid.vo";

@Injectable()
export class SessionRepository {
    constructor(private readonly prisma: PrismaService){}

    async findByToken(hashedToken: string):Promise<Session | null>{
        const token = await this.prisma.session.findUnique({
            where:{
                hashedToken: hashedToken
            }
        })
        if(!token) return null;
        return this.refreshTokenMapper(token)
    }

    async findByUserId(identityId: string): Promise<Session | null>{
        const token = await this.prisma.session.findUnique({
            where:{
                identityId:identityId
            }
        })
        if(!token) return null;
        return this.refreshTokenMapper(token)
    }

    async updateSession(token: PrismaSession): Promise<Session>{
        const updatedToken = await this.prisma.session.update({
            where:{ id: token.id },
            data:{
                expiresAt:token.expiresAt,
            }
        })
        return Session.formDate(updatedToken)
    }

    async deleteSessionById(userId: string){
        await this.prisma.session.deleteMany({
            where:{
                identityId: userId
            }
        })
    }

    async createSession(session: Session):Promise<Session>{
        const refreshTokenCreated = await this.prisma.session.create({
            data:{
                id: session.id,
                hashedToken: session.hashedToken,
                identityId: session.identityId.getValue(),
                expiresAt: session.expiresAt,
                createdAt: session.createdAt,
            }
        })
        return Session.formDate(refreshTokenCreated)
    }

    refreshTokenMapper(session: PrismaSession): Session {
        return Session.formDate(session);
    }

}