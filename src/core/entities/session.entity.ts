import { Session as prismaSession } from "@prisma/client";
import { UserId } from "src/core/value-objects/userid.vo";
import { v4 as uuidv4 } from 'uuid';

interface SessionProps {
  hashedToken: string;    // Уже захэшированный Refresh Token
  identityId: UserId;     // ID пользователя (Identity)
  id?: string;            // Опционально (если создаем из БД, ID уже есть)
  createdAt?: Date;       // Опционально (дата создания из БД)
  expiresAt?: Date,
  expirationDays?:number,
}

export class Session {
    _id: string;
    _hashedToken: string;
    _identityId: UserId;
    _createdAt: Date;
    _expiresAt: Date;

    constructor(props: SessionProps){
        const now = new Date();
        props.expirationDays = Number(props.expirationDays)
        this._id = props.id || uuidv4();
        this._hashedToken = props.hashedToken;
        this._identityId = props.identityId;
        this._expiresAt = props.expiresAt ? props.expiresAt : new Date(now.getTime() + (props.expirationDays || 30)  * 24 * 60 * 60 * 1000);
        this._createdAt = props.createdAt || new Date();
    }

    get id(){
      return this._id;
    }

    get hashedToken(){
      return this._hashedToken;
    }

    get identityId(){
      return this._identityId;
    }
     
    get expiresAt(){
      return this._expiresAt;
    }

    get createdAt(){
      return this._createdAt;
    }



    isExpired(){
        return new Date() > this._expiresAt;
    }



    static formDate(data: prismaSession){
      const identityId = UserId.create(data.identityId)
      return new Session({ ...data, identityId });
    }



   




}