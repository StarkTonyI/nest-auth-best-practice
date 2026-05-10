import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateRoleCommand } from "./impl/createRole.command";
import { RoleRepository } from "src/infrastructure/repository/role-repository.service";
import { PermissionRepository } from "src/infrastructure/repository/permission-repository.service";
import { EntityAlreadyExistsException, EntityNotFoundException } from "src/exeption/domain-exeptions";
import { Role } from "src/core/entities/role.entity";
import { PermissionCollection } from "src/value-objects/collection/permission.collection";

@CommandHandler(CreateRoleCommand)
export class CreateRoleHandler implements ICommandHandler<CreateRoleCommand> {
    constructor(
        private readonly roleRepository: RoleRepository, 
        private readonly permissionRepository: PermissionRepository
    ){};
    async execute(command: CreateRoleCommand): Promise<any> {
        const { role, description, permissionName, isDefault } = command;

        const findRole = await this.roleRepository.findByRoleName(role);
        const findPermission = await this.permissionRepository.findByName(permissionName);

        if(findRole){
            throw new EntityAlreadyExistsException("Role")
        }

        if(!findPermission){
            throw new EntityNotFoundException("Permission")
        }

        if(isDefault){
            const findDefaultRole = await this.roleRepository.findDefaultRole();
            if(!findDefaultRole) throw new EntityNotFoundException("Role", { reason:"Default role is not exist!", entityId:'' });
            findDefaultRole.removeDefault();
            await this.roleRepository.updateRole(findDefaultRole)
        }
        const permissionCollection = new PermissionCollection([findPermission]);
        const domainRole = Role.create({ name: role, description, isDefault: true, permissionCollection});

        const newRole = await this.roleRepository.createRole(domainRole);

        return Role.toDetailResponse(newRole)

    }


}















