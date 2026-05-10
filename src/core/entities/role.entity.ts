import { RoleId } from "src/value-objects/role-id.vo";
import { Identity } from "./Identity.entity";
import { Permission } from "./permission.entity";
import { Role as PrismaRole } from '@prisma/client'
import { PermissionCollection } from "src/value-objects/collection/permission.collection";
interface RoleInterface{
    id: RoleId, 
    name: string,
    description: string,
    isDefault: boolean;

    createdAt?: Date,
    updatedAt?: Date

    permissionsCollection: PermissionCollection
    users?: Identity[];
    
}

interface RoleCreateInput {
  name: string;
  description: string;
  isDefault: boolean;
  permissionCollection: PermissionCollection
}

export class Role { 
    _id: RoleId;
    _name: string;
    _description: string;
    _isDefault:boolean;
    _permissionsCollection: PermissionCollection;
    _createdAt: Date;
    _updatedAt:Date;

    constructor(rolePayload: RoleInterface){
        this._id = rolePayload.id;
        this._name = rolePayload.name;
        this._description = rolePayload.description;
        this._isDefault = rolePayload.isDefault;
        this._permissionsCollection = rolePayload.permissionsCollection || [];
        this._createdAt = rolePayload.createdAt ? rolePayload.createdAt : new Date();
        this._updatedAt = rolePayload.updatedAt ? rolePayload.updatedAt : new Date();
    }


    get id(){
        return this._id;
    }
    get name(){
        return this._name;
    }
    get description(){
        return this._description;
    }
    get isDefault(){
        return this._isDefault;
    }
    get permissionCollection(){
        return this._permissionsCollection;
    }
    get createdAt(){
        return this._createdAt;
    }
    get updatedAt(){
        return this._updatedAt;
    }

    isAdmin(){
        return this._name === 'admin'
    }

    isDefaultRole(){
        return !!this._isDefault;
    }

    addPermission(permission: Permission){
        this._permissionsCollection.addPermission(permission);
    }

    removeDefault(){
        if(!this._isDefault){
            return;
        }
        this._isDefault = false;
        this._updatedAt = new Date();
    }

    isPermissionAlreadyExist(permissions: Permission){
        return this._permissionsCollection.permissionAlreadyExist(permissions)
    }

    static create(rolePayload: RoleCreateInput){
       const id = RoleId.createId();
       const { name, description, isDefault } = rolePayload;
       return new Role({ id, name, description, isDefault, permissionsCollection: rolePayload.permissionCollection})
    }

    static formData(rolePayload: PrismaRole, permissions: Permission[]){
        const { name, description, isDefault, createdAt, updatedAt } = rolePayload;
        const id = RoleId.fromString(rolePayload.id);
        const permissionsCollection = new PermissionCollection(permissions)
        return new Role({ id, name, description, isDefault, createdAt, updatedAt, permissionsCollection: permissionsCollection})
    }

    static toDetailResponse(role: Role){
        return {
            id: role.id.value,
            name: role.name,
            description: role.description,
            isDefault: role.isDefault,
            permission: [...role._permissionsCollection].map(i => {
                return {
                    id: i.id.value, 
                    name: i.name, 
                    description: i.description,
                    createdAt: i.createdAt,
                    updatedAt: i.updatedAt
                }
            }),
            createdAt: role.createdAt,
            updatedAt: role.updatedAt
        }
    }
}