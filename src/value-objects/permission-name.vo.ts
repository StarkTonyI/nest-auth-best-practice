import { InvalidInputException } from "src/exeption/domain-exeptions";
import { SeedActionType, SeedResourceType } from "./permission-resourceAction.vo";

export class PermissionName {
  _name: string;
  _action: string;
  _resource: string;
  private constructor(actionResource: string) {
    const [action, resource] = actionResource.split(':') 

    this._action = action;
    this._resource = resource;
    this._name = actionResource;
  }

  get action(){
    return this._action;
  }

  get resource(){
    return this._resource;
  }

  get uniqName(){
    return this._name;
  }

  static create(action: SeedActionType, resource: SeedResourceType) {
    return new PermissionName(`${action}:${resource}`);
  }

  static fromString(value: string) {
    const parts = value.split(':');

    if (parts.length !== 2) {
      throw new InvalidInputException('Invalid permission format');
    }

    const [action, resource] = parts;

    if (!Object.values(SeedActionType).includes(action as SeedActionType)) {
      throw new InvalidInputException(`Invalid action: ${action}`);
    }

    if (!Object.values(SeedResourceType).includes(resource as SeedResourceType)) {
      throw new InvalidInputException(`Invalid resource: ${resource}`);
    }

    return new PermissionName(value as `${SeedActionType}:${SeedResourceType}`);
  }
}