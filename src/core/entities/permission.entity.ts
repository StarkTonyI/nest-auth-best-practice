import { PermissionId } from "src/core/value-objects/permission-id.vo";
import { PermissionName } from "src/core/value-objects/permission-name.vo";
import { ActionResource } from "src/core/value-objects/permission-resourceAction.vo";

interface PermissionPayload {
    id: PermissionId;
    description: string;
    resourceAction: ActionResource;
    createdAt?: Date;
    updatedAt?: Date;
}

export class Permission {
    _id: PermissionId;
    _name: PermissionName;
    _description: string;
    _resourceAction: ActionResource;
    _createdAt: Date;
    _updatedAt: Date;

    constructor(permission: PermissionPayload){
        this._id = permission.id;
        this._name = PermissionName.create(permission.resourceAction.action, permission.resourceAction.resource);
        this._description = permission.description;
        this._resourceAction = permission.resourceAction;
        this._createdAt = permission.createdAt ? permission.createdAt : new Date();
        this._updatedAt = permission.updatedAt ? permission.updatedAt : new Date();
    }


    get id(){
        return this._id
    }

    get name(){
        return this._name.uniqName;
    }

    get description(){
        return this._description
    }

    get resourceAction(){
        return this._resourceAction
    }

    get createdAt(){
        return this._createdAt
    }

    get updatedAt(){
        return this._updatedAt
    }


    static create(action: string, resource: string, description?: string){
        const id = PermissionId.createId();
        const resourceAction = new ActionResource(action, resource);
        return new Permission({ id, resourceAction, description: description || '' })
    }

    static fromData(permissionStr:{ id: string, description: string, resourceStr: string, 
        actionStr: string, createdAt: Date, updatedAt: Date }): Permission{
        const { id, description, resourceStr, actionStr, createdAt, updatedAt } = permissionStr;
        return new Permission({ id:PermissionId.fromString(id), description, resourceAction: new ActionResource(actionStr, resourceStr),
             createdAt, updatedAt })
    }

    static toDetailResopnse(permission: Permission){
        return {
            id: permission.id.value,
            name: permission.name,
            descriprion: permission.description,
            createdAt: permission.createdAt,
            updatedAt: permission.updatedAt
        }
    }

}


