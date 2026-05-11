import { JwtPayload } from "src/shared/interfaces/jwtPayload.interface";
import { SafeUser } from "src/types/prisma-user";

declare global {
    namespace Express {
        interface Request {
            user: JwtPayload | SafeUser,
            rawRefresh: string
        }
    }
}