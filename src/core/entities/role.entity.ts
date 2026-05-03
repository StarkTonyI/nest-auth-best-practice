import { RoleId } from "src/value-objects/role-id.vo";
import { Identity } from "./Identity.entity";
import { Permission } from "./permission.entity";
import { Role as PrismaRole } from '@prisma/client'
interface RoleInterface{
    id: RoleId, 
    name: string,
    description: string,
    isDefault: boolean;

    createdAt?: Date,
    updatedAt?: Date

    users?: Identity[];
    permissions?: Permission[]
    
}

interface RoleCreateInput {
  name: string;
  description: string;
  isDefault: boolean;
}

export class Role { 
    _id: RoleId;
    _name: string;
    _description: string;
    _isDefault:boolean;
    _permission?: Permission[];
    _createdAt: Date;
    _updatedAt:Date;

    constructor(rolePayload: RoleInterface){
        this._id = rolePayload.id;
        this._name = rolePayload.name;
        this._description = rolePayload.description;
        this._isDefault = rolePayload.isDefault;
        this._permission = rolePayload.permissions;
        this._createdAt = rolePayload.createdAt ? rolePayload.createdAt : new Date();
        this._updatedAt = rolePayload.updatedAt ? rolePayload.updatedAt : new Date();
    }


    get id(){
        return this.id;
    }
    
    get name(){
        return this.name;
    }

    get description(){
        return this.description;
    }

    get isDefault(){
        return this.isDefault;
    }
    get permission(){
        return this.permission;
    }

    get createdAt(){
        return this.createdAt;
    }

    get updatedAt(){
        return this.updatedAt;
    }

    addPermission(permission: Permission[]){
        this._permission = (this._permission  || []).concat(permission);
    }

    removeDefault(){
        if(!this._isDefault){
            return;
        }
        this._isDefault = false;
        this._updatedAt = new Date();
    }


    static create(rolePayload: RoleCreateInput){
       const id = RoleId.createId();
       const { name, description, isDefault } = rolePayload;
       return new Role({ id, name, description, isDefault})
    }

    static formData(rolePayload: PrismaRole, permissions?: Permission[]){
        const { name, description, isDefault, createdAt, updatedAt } = rolePayload;
        const id = RoleId.fromString(rolePayload.id)
        return new Role({ id, name, description, isDefault, createdAt, updatedAt, permissions})
    }

    static toDetailResponse(role: Role){
        return {
            id: role.id.value,
            name: role.name,
            description: role.description,
            isDefault: role.isDefault,
            permission: role.permission ? role.permission.map(i => { 
                return Permission.toDetailResopnse(i)
             }) : [],
            createdAt: role.createdAt,
            updatedAt: role.updatedAt
        }
    }
}