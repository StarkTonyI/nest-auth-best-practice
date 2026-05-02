import { Email } from "src/value-objects/email.vo";
import { UserId } from "src/value-objects/userid.vo";
import { Profile } from "./profile.entity";
import { Session } from "./session.entity";
import { FirstName, LastName } from "src/value-objects/name.vo";
import { Role } from "./role.entity";
interface IdentityProps {
   id: UserId;
   email: Email;
   passwordHash: string;
  createdAt?: Date;
  updatedAt?: Date;
  
  role: Role[];
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
    private role: Role[] = []
    
    constructor(props: IdentityProps){
        this.id = props.id,
        this.email = props.email,
        this.passwordHash = props.passwordHash,
    
        this.createdAt = props.createdAt || new Date(),
        this.updatedAt = props.updatedAt || new Date()

        this.profile = props.profile;
        this.session = props.session;
        this.role = props.role;
    }

    get getEmail(){
        return this.email;
    }

    get getEmailValue(){
        return this.email.value;
    }

    get getPasswordHash(){
        return this.passwordHash;
    }

    get userCreateUpdateDate(){
        return {
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }

    get getId(){
        return this.id;
    }

    get getIdValue(){
        return this.id.value
    }

    get getProfile(){
        return this.profile
    }

    get getRoles(){
        return this.role;
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

    addRoles(role: Role){
        this.role.push(role)
    }   

    static create(email: Email, passwordHash: string){
        const id = UserId.create()
        return new Identity({ id, email, passwordHash, role:[] })
    } 

    static formData(data: { id: string, email: string, passwordHash: string, createdAt: Date, updatedAt: Date, roles: Role[] } ):Identity{
        const id = UserId.fromString(data.id)
        const email = new Email(data.email);
        return new Identity({...data, email, id, role: data.roles})
    }

    static toDetailResponse(identity: Identity){
        return {
            id: identity.id.value,
            email: identity.getEmail.value,
            createdAt: identity.createdAt,
            updatedAt: identity.updatedAt,
            profile: identity.getProfile ? Profile.toDetailResponse(identity.getProfile) : {},
            role: identity.getRoles ? identity.getRoles.map(i => Role.toDetailResponse(i) ) : {}
        }
    }

}