import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateRoleCommand } from "./impl/createRole.command";
import { RoleRepository } from "src/infrastructure/repository/role-repository.service";
import { PermissionRepository } from "src/infrastructure/repository/permission-repository.service";
import { EntityAlreadyExistsException, EntityNotFoundException } from "src/exeption/domain-exeptions";
import { Permission } from "src/core/entities/permission.entity";
import { Role } from "src/core/entities/role.entity";

@CommandHandler(CreateRoleCommand)

export class CreateRoleHandler implements ICommandHandler<CreateRoleCommand> {
    constructor(private readonly roleRepository: RoleRepository,private readonly permissionRepository: PermissionRepository){}
    async execute(command: CreateRoleCommand): Promise<any> {
    
        const { role, description, permissionName } = command;

        const findRole = await this.roleRepository.findByRoleName(role);
        const findPermission = await this.permissionRepository.findByName(permissionName);

        if(findRole){
            throw new EntityAlreadyExistsException("Role")
        }
        if(!findPermission){
            throw new EntityNotFoundException("Permission")
        }


        const domainRole = Role.create({ name: role, description, isDefault: true });
        domainRole.addPermission([findPermission]);

        return Role.toDetailResponse(domainRole);
    }


}

