import { Session as prismaSession } from "@prisma/client";
import { UserId } from "src/value-objects/userid.vo";
import { uuid } from "uuidv4";

interface SessionProps {
  hashedToken: string;    // Уже захэшированный Refresh Token
  identityId: UserId;     // ID пользователя (Identity)
  id?: string;            // Опционально (если создаем из БД, ID уже есть)
  createdAt?: Date;       // Опционально (дата создания из БД)
  expiresAt?: Date,
  expirationDays?:number,

}

export class Session {
    id: string;
    hashedToken: string;
    identityId: UserId;
    createdAt: Date;
    expiresAt: Date;

    constructor(props: SessionProps){
        const now = new Date();
        props.expirationDays = Number(props.expirationDays)
        this.id = props.id || uuid();
        this.hashedToken = props.hashedToken;
        this.identityId = props.identityId;
        this.expiresAt = props.expiresAt ? props.expiresAt : new Date(now.getTime() + (props.expirationDays || 30)  * 24 * 60 * 60 * 1000);
        this.createdAt = props.createdAt || new Date();
    }

    static formDate(data: prismaSession){
      const identityId = UserId.create(data.identityId)
      return new Session({...data, identityId});
      
    }

    isExpired(){
        return new Date() > this.expiresAt;
    }


}