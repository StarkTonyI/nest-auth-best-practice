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
    private _id: UserId
    private _passwordHash: string;
    private _email: Email;
    private _createdAt: Date;
    private _updatedAt: Date
    private _profile?: Profile;
    private _session?: Session
    private _role: Role[] = []
    
    constructor(props: IdentityProps){
        this._id = props.id,
        this._email = props.email,
        this._passwordHash = props.passwordHash,
    
        this._createdAt = props.createdAt || new Date(),
        this._updatedAt = props.updatedAt || new Date()

        this._profile = props.profile;
        this._session = props.session;
        this._role = props.role;
    }

    get id(){
        return this._id;
    }

    get email(){
        return this._email;
    }

    get passwordHash(){
        return this._passwordHash;
    }

    get createdAt(){
        return this._createdAt;
    }

    get updatedAt(){
        return this._updatedAt;
    }

    get profile(){
        return this._profile;
    }

    get session(){
        return this._session;
    }

    get role(){
        return this._role;
    }

    createNewProfile(firstName: FirstName, lastName: LastName){
        const profile = Profile.create({ firstName, lastName, identityId: this.id });
        this._profile = profile;
    }

    createNewSession(hashedToken: string, expirationDays: number){
        const identityId = this.id;
        const session = new Session({ hashedToken, identityId, expirationDays })
        this._session = session;
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
            email: identity.email.value,
            createdAt: identity.createdAt,
            updatedAt: identity.updatedAt,
            profile: identity.profile ? Profile.toDetailResponse(identity.profile) : {},
            role: identity.role ? identity.role.map(i => Role.toDetailResponse(i) ) : {}
        }
    }

}