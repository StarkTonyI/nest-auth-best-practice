import { Session as PrismaSession } from "@prisma/client";
import { Session } from "src/core/entities/session.entity";

export interface iSessionRepository {
    findByToken:(hashedToken: string)=> Promise<Session | null>
    findById:(identityId: string)=> Promise<Session | null>
    updateSession:(session: PrismaSession)=> Promise<Session>
    deleteSessionById:(userId: string)=> Promise<void>
    createSession(session: Session):Promise<Session>
}