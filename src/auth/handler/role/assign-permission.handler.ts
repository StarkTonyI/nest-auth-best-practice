import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { AssingPermissionCommand } from "./impl/assign-permission.command";
import { Role } from "src/core/entities/role.entity";
import { RoleRepository } from "src/infrastructure/repository/role-repository.service";
import { EntityAlreadyExistsException, EntityNotFoundException, ForbiddenActionException } from "src/exeption/domain-exeptions";
import { Permission } from "src/core/entities/permission.entity";
import { PermissionRepository } from "src/infrastructure/repository/permission-repository.service";
import { PermissionCollection } from "src/value-objects/collection/permission.collection";
import { isAdminRoleSpecification } from "src/specifications/role.specifications";

@CommandHandler(AssingPermissionCommand)
export class AssingPermissionHandler implements ICommandHandler<AssingPermissionCommand>{
    constructor(
        private readonly roleRepository: RoleRepository, 
        private readonly permissionRepository: PermissionRepository){}
    async execute(command: AssingPermissionCommand): Promise<any> {
        const { role, action, resource } = command;

        const findRole = await this.roleRepository.findByRoleName(role);
        
        if(!findRole){
            throw new EntityNotFoundException("role")
        }

        const newPermisssion = Permission.create(action, resource, '');
        const findPermission = await this.permissionRepository.findByName(newPermisssion.name)

        if(!findPermission){
            throw new EntityNotFoundException("Permission")
        }

        const isAdminRole = new isAdminRoleSpecification();
        const isPermissionAlreadyExist = findRole.isPermissionAlreadyExist(newPermisssion)
        
        if(!isPermissionAlreadyExist){
            throw new EntityAlreadyExistsException("")
        }

        if(!isAdminRole.isSatisfiedBy(findRole) && !findRole.permissionCollection.hasAdminPermission()){
            throw new ForbiddenActionException("Impossible action")
        }

        console.log("Okaaaaay")


        const newRole = await this.roleRepository.assignPermission(findRole, findPermission);


        return Role.toDetailResponse(newRole)
    }
}

