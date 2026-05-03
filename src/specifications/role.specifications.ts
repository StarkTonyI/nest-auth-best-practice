import { Role } from "src/core/entities/role.entity";
import {  Specification } from "./base.specifications";

export class IsDefaultRoleSpecification extends Specification<Role> {
    isSatisfiedBy(candidate: Role): boolean {
        return candidate.isDefault
    }
}