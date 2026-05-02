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
    id: RoleId;
    name: string;
    description: string;
    isDefault:boolean;
    permission?: Permission[];
    createdAt: Date;
    updatedAt:Date;

    constructor(rolePayload: RoleInterface){
        this.id = rolePayload.id;
        this.name = rolePayload.name;
        this.description = rolePayload.description;
        this.isDefault = rolePayload.isDefault;
        this.permission = rolePayload.permissions;
        this.createdAt = rolePayload.createdAt ? rolePayload.createdAt : new Date();
        this.updatedAt = rolePayload.updatedAt ? rolePayload.updatedAt : new Date();
    }

    addPermission(permission: Permission[]){
        this.permission = (this.permission  || []).concat(permission);
    }

    removeDefault(){
        if(!this.isDefault){
            return;
        }
        this.isDefault = false;
        this.updatedAt = new Date();
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