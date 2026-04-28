import { FirstName, LastName, Name, UserName } from "src/value-objects/name.vo";
import { UserId } from "src/value-objects/userid.vo";

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
    id: UserId;
    userName: UserName;
    firstName: FirstName;
    lastName: LastName;
    avatarUrl: string;
    bio: string;
    identityId: UserId;
    createdAt: Date;
    updatedAt: Date

    constructor(props: ProfileProps){
        this.id = props.id || UserId.create(),
        this.userName = props.userName,
        this.firstName = props.firstName,
        this.lastName = props.lastName,
        this.avatarUrl = props.avatarUrl || '',
        this.bio = props.bio || '',
        this.identityId = props.identityId,
        this.createdAt = props.createdAt || new Date()
        this.updatedAt = props.updatedAt || new Date()
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
            id: profile.id.getValue,
            userName: profile.userName.getValue,
            firstName: profile.firstName.getValue,
            lastName: profile.lastName.getValue,
            avatarUrl: profile.avatarUrl,
            createdAt: profile.createdAt,
            updatedAt: profile.updatedAt
        }
    }

}