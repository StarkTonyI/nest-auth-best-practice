import { Injectable } from "@nestjs/common";
import { Session as PrismaSession } from "@prisma/client";
import { Session } from "src/core/entities/session.entity";
import { PrismaService } from "src/database/dataBase.service";
import { iSessionRepository } from "src/interfaces/repository/sessoin-repository";

@Injectable()
export class SessionRepository implements iSessionRepository{
    constructor(private readonly prisma: PrismaService){}

    async findByToken(hashedToken: string):Promise<Session | null>{
        const session = await this.prisma.session.findUnique({
            where:{
                hashedToken: hashedToken
            }
        })
        if(!session) return null;
        return this.sessionMapper(session)
    }

    async findById(identityId: string): Promise<Session | null>{
        const session = await this.prisma.session.findUnique({
            where:{
                identityId:identityId
            }
        })
        if(!session) return null;
        return this.sessionMapper(session)
    }

    async updateSession(session: PrismaSession): Promise<Session>{
        const updatedToken = await this.prisma.session.update({
            where:{ id: session.id },
            data:{
                expiresAt:session.expiresAt,
            }
        })
        return Session.formDate(updatedToken)
    }

    async deleteSessionById(userId: string): Promise<void>{
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
                identityId: session.identityId.value,
                expiresAt: session.expiresAt,
                createdAt: session.createdAt,
            }
        })
        return Session.formDate(refreshTokenCreated)
    }

    sessionMapper(session: PrismaSession): Session {
        return Session.formDate(session);
    }

}


