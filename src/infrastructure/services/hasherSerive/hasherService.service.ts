import { Injectable } from "@nestjs/common";
import * as bcrypt from 'bcrypt'
import * as crypto from 'crypto'; // Именно так для Node.js
@Injectable()
export class HasherService {
    constructor(){}
    async hash(password: string){
        return await bcrypt.hash(password, 10)
    }
    async compare(password: string, hashedPassword: string){
        return await bcrypt.compare(password, hashedPassword)
    }   

    async hashToken(rawRefreshToken: string){
        const hashedToken = crypto.createHash('sha256').update(rawRefreshToken).digest('hex');
        return hashedToken
    }

}