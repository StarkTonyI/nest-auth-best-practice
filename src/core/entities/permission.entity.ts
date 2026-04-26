import { PermissionId } from "src/value-objects/permission-id.vo";
import { PermissionName } from "src/value-objects/permission-name.vo";
import { ActionResource } from "src/value-objects/permission-resourceAction.vo";

interface PermissionPayload {
    id: PermissionId;
    description: string;
    resourceAction: ActionResource;
    createdAt?: Date;
    updatedAt?: Date;
}

export class Permission {
    id: PermissionId;
    name: PermissionName;
    description: string;
    resourceAction: ActionResource;
    createdAt: Date;
    updatedAt: Date;

    constructor(permission: PermissionPayload){
        this.id = permission.id;
        this.name = PermissionName.create(permission.resourceAction.getAction, permission.resourceAction.getResource);
        this.description = permission.description;
        this.resourceAction = permission.resourceAction;
        this.createdAt = permission.createdAt ? permission.createdAt : new Date();
        this.updatedAt = permission.updatedAt ? permission.updatedAt : new Date();
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
            id: permission.id.getValue,
            name: permission.name.name,
            descriprion: permission.description,
            createdAt: permission.createdAt,
            updatedAt: permission.updatedAt
        }
    }

}


