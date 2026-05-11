import { Permission } from "src/core/entities/permission.entity";
import { InvalidValueObjectException } from "src/core/exeption/domain-exeptions";

export class PermissionCollection {
    private readonly _permissions: Permission[]
    constructor(permissions: Permission[]){
        this.validatedPermissions(permissions)
        this._permissions = permissions;
    }

    *[Symbol.iterator](): Iterator<Permission> {
    for (const permission of this._permissions) {
      yield permission;
    }
  }

    addPermission(permission: Permission){
        this._permissions.push(permission)
    }
 

    hasAdminPermission(){
        const adminAction = new Set(['update', 'delete', 'create']);
        const adminResource = new Set(['role', 'storage', 'user', 'audit']);

        return this._permissions.some((i) => {
            const action = i._resourceAction.action;
            const resource = i.resourceAction.resource;

            return adminAction.has(action) && adminResource.has(resource);
        })
    }


    permissionAlreadyExist(permission: Permission): boolean{
        return this._permissions.some(i => {
            if(i.resourceAction.action === permission.resourceAction.action){
                return false;
            }
            if(i.resourceAction.resource === permission.resourceAction.resource){
                return false;
            }
            return true;
        })
    }


    validatedPermissions(permissions: Permission[]){
        const permissionId = new Set();
        const permissionName = new Set();

        for(const permission of permissions){
            if(permissionId.has(permission.id.value)){
                throw new InvalidValueObjectException(`${permission.id.value} already exist in collection`)
            }
            if(permissionName.has(permission.name)){
                throw new InvalidValueObjectException(`${permission.name} already exist in collection`)
            }
            permissionId.add(permission.id.value);
            permissionName.add(permission.name)
        }
    }

}