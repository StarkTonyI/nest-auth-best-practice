import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { AssingPermissionCommand } from "src/application/commands/role/impl/assign-permission.command";
import { Permission } from "src/core/entities/permission.entity";
import { Role } from "src/core/entities/role.entity";
import { EntityAlreadyExistsException, EntityNotFoundException, ForbiddenActionException } from "src/core/exeption/domain-exeptions";
import { isAdminRoleSpecification } from "src/core/specifications/role.specifications";
import { PermissionRepository } from "src/infrastructure/repository/permission-repository.service";
import { RoleRepository } from "src/infrastructure/repository/role-repository.service";

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



        const newRole = await this.roleRepository.assignPermission(findRole, findPermission);


        return Role.toDetailResponse(newRole)
    }
}

