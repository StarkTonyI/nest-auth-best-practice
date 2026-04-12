import { Email } from "src/value-objects/email.vo";
import { UserId } from "src/value-objects/userid.vo";
import { Profile } from "./profile.entity";
import { Session } from "./session.entity";
import { FirstName, LastName } from "src/value-objects/name.vo";

interface IdentityProps {
  id: UserId;
  email: Email;
  passwordHash: string;
  createdAt?: Date;
  updatedAt?: Date;
  
  profile?: Profile;
  session?: Session
}

export class Identity {
    private id: UserId
    private passwordHash: string;
    private email: Email;
    private readonly createdAt: Date;
    private updatedAt: Date
    private profile?: Profile;
    private session?: Session
    
    constructor(props: IdentityProps){
        this.id = props.id,
        this.email = props.email,
        this.passwordHash = props.passwordHash,
    
        this.createdAt = props.createdAt || new Date(),
        this.updatedAt = props.updatedAt || new Date()

        this.profile = props.profile;
        this.session = props.session;
    }

    get userEmail(){
        return this.email;
    }

    get userEmailValue(){
        return this.email.getValue;
    }

    get userPasswordHash(){
        return this.passwordHash;
    }

    get userCreateUpdateDate(){
        return {
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }

    get identityId(){
        return this.id;
    }

    get identityIdValue(){
        return this.id.getValue
    }

    get getProfile(){
        return this.profile
    }

    createNewProfile(firstName: FirstName, lastName: LastName){
        const profile = Profile.create({ firstName, lastName, identityId: this.id });
        this.profile = profile;
    }

    createNewSession(hashedToken: string, expirationDays: number){
        const identityId = this.id;
        const session = new Session({ hashedToken, identityId, expirationDays })
        this.session = session;
        return session;
    }

    static create(email: Email, passwordHash: string){
        const id = UserId.create()
        return new Identity({ id, email, passwordHash })
    } 

    static formData(data: { id: string, passwordHash:string, email: string, createdAt: Date, updatedAt: Date } ):Identity{
        const id = UserId.fromString(data.id)
        const email = new Email(data.email);
        return new Identity({...data, email: email, id: id})
    }
}