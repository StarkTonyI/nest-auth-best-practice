import { FirstName, LastName, Name, UserName } from "src/core/value-objects/name.vo";
import { UserId } from "src/core/value-objects/userid.vo";

interface ProfileProps {
  id?: UserId;
  userName: UserName; // Твой VO для уникального ника
  firstName: FirstName; // Твой VO для имени
  lastName: LastName;   // Твой VO для фамилии
  avatarUrl?: string;   // Опционально, если юзер еще не загрузил фото
  bio?: string;         // Опционально
  identityId: UserId;
  createdAt?: Date;
  updatedAt?: Date;
}

interface createPayload {
    firstName: FirstName,
    lastName: LastName,
    identityId: UserId
}

export class Profile {
    _id: UserId;
    _userName: UserName;
    _firstName: FirstName;
    _lastName: LastName;
    _avatarUrl: string;
    _bio: string;
    _identityId: UserId;
    _createdAt: Date;
    _updatedAt: Date

    constructor(props: ProfileProps){
        this._id = props.id || UserId.create(),
        this._userName = props.userName,
        this._firstName = props.firstName,
        this._lastName = props.lastName,
        this._avatarUrl = props.avatarUrl || '',
        this._bio = props.bio || '',
        this._identityId = props.identityId,
        this._createdAt = props.createdAt || new Date()
        this._updatedAt = props.updatedAt || new Date()
    }

    get id(){
        return this._id
    }

    get userName(){
        return this._userName
    }

    get firstName(){
        return this._firstName;
    }
    
    get lastName(){
        return this._lastName;
    }

    get avatarUrl(){
        return this._avatarUrl;
    }

    get bio(){
        return this._bio;
    }

    get identityId(){
        return this._identityId;
    }

    get createdAt(){
        return this._createdAt;
    }

    get updatedAt(){
        return this._updatedAt;
    }


    static create(createPayload: createPayload){
        const userName = new UserName();
        const { firstName, lastName, identityId } = createPayload;
        return new Profile({ userName, firstName, lastName, identityId })
    }

    static formData(createdPayload = { idStr: '', userNameStr:'', firstNameStr:'', lastNameStr: '', identityId: '', 
    createdAt:new Date(), updatedAt: new Date(), avatarUrl:'', bio: ''  }){
        const id = UserId.fromString(createdPayload.idStr);
        const userName = new UserName(createdPayload.userNameStr);
        const firstName = new FirstName(createdPayload.firstNameStr);
        const lastName = new LastName(createdPayload.lastNameStr);
        const identityId = UserId.fromString(createdPayload.identityId)
        const { createdAt, updatedAt, avatarUrl, bio } = createdPayload;
        return new Profile({ 
        id, userName, firstName, lastName, identityId,
        createdAt, updatedAt, avatarUrl, bio})
    }

    static toDetailResponse(profile: Profile){
        return {
            id: profile.id.value,
            userName: profile.userName.value,
            firstName: profile.firstName.value,
            lastName: profile.lastName.value,
            avatarUrl: profile.avatarUrl,
            createdAt: profile.createdAt,
            updatedAt: profile.updatedAt
        }
    }

}