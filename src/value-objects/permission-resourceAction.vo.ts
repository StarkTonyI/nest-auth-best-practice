import { InvalidInputException } from "src/exeption/domain-exeptions";

export enum SeedActionType {
  READ = 'read',
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
}

// Было SeedResourceType -> Стало SeedSeedResourceType
export enum SeedResourceType {
  USER = 'user',
  ROLE = 'role',
  STORAGE = 'storage',
  AUDIT = 'audit',
}

export enum DefaultRoles {
  ADMIN = 'admin',
  USER = 'user'
}


export class ActionResource {
    private _action: SeedActionType;
    private _resource: SeedResourceType;
    constructor(action: SeedActionType | string, resource: SeedResourceType | string){
      const actionType = typeof action === 'string' ? this.parseAction(action) : action;
      const resourceType = typeof resource === 'string' ? this.parseResource(resource) : resource;

      this._action = actionType;
      this._resource = resourceType;
      
    }

    parseAction(action: string): SeedActionType { 
        if(Object.values(SeedActionType).includes(action as SeedActionType)){
            return action as SeedActionType;
        }
        throw new InvalidInputException("Action type is impossible")
    }

    parseResource(action: string): SeedResourceType { 
        if(Object.values(SeedResourceType).includes(action as SeedResourceType)){
            return action as SeedResourceType;
        }
        throw new InvalidInputException("Resource type is impossible")
    }

    get action(){
      return this._action;
    }

    get resource(){
      return this._resource;
    }
}