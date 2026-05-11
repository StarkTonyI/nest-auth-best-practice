import { Role } from "src/core/entities/role.entity";
import {  Specification } from "./base.specifications";
import { Permission } from "src/core/entities/permission.entity";

export class IsDefaultRoleSpecification extends Specification<Role> {
    isSatisfiedBy(candidate: Role): boolean {
        return candidate.isDefaultRole()
    }
}

export class isAdminRoleSpecification extends Specification<Role> {
    isSatisfiedBy(candidate: Role): boolean {
        return candidate.isAdmin()
    }
}

export class isPermissionAlreadyExist extends Specification<Role> {
    constructor(private readonly permission: Permission){
        super()
    }
    isSatisfiedBy(candidate: Role): boolean {
        return candidate.isPermissionAlreadyExist(this.permission)
    }

}

export class isAssignPermissionPossible extends Specification<Role> {
    constructor(private readonly permission: Permission){super()}
    isSatisfiedBy(candidate: Role): boolean {
        const isAdmin = new isAdminRoleSpecification();
        const isPermissionExist = new isPermissionAlreadyExist(this.permission)
        return isAdmin.and(isPermissionExist).isSatisfiedBy(candidate)

    }
}













