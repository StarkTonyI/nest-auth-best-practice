import { RoleId } from "src/value-objects/role-id.vo";

interface RoleInterface {
    id: RoleId, 
    name: string,
    descritpion: string,
    isDefault: boolean;

    createdAt?: Date,
    updatedAt?: Date
}

export class Role { 
    id: RoleId;
    name: string;
    description: string;
    isDefault:boolean;
    createdAt: Date;
    updatedAt:Date;

    constructor(rolePayload: RoleInterface){
        this.id = rolePayload.id;
        this.name = rolePayload.name;
        this.description = rolePayload.descritpion;
        this.isDefault = rolePayload.isDefault;
        this.createdAt = rolePayload.createdAt ? rolePayload.createdAt : new Date();
        this.updatedAt = rolePayload.updatedAt ? rolePayload.updatedAt : new Date();
    }

    static create(rolePayload: RoleInterface){
       const id = rolePayload.id ? rolePayload.id : RoleId.createId();
       const { name, descritpion, isDefault } = rolePayload;
       return new Role({ id, name, descritpion, isDefault})
    }

    static formData(rolePayload: RoleInterface){
        const { id, name, descritpion, isDefault, createdAt, updatedAt } = rolePayload;
        return new Role({ id, name, descritpion, isDefault, createdAt, updatedAt })
    }

}