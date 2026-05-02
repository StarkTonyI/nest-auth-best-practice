import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { AssingPermissionCommand } from "./impl/assign-permission.command";
import { Role } from "src/core/entities/role.entity";
import { RoleRepository } from "src/infrastructure/repository/role-repository.service";
import { EntityNotFoundException } from "src/exeption/domain-exeptions";
import { Permission } from "src/core/entities/permission.entity";
import { PermissionRepository } from "src/infrastructure/repository/permission-repository.service";

@CommandHandler(AssingPermissionCommand)
export class AssingPermissionHandler implements ICommandHandler<AssingPermissionCommand>{
    constructor(private readonly roleRepository: RoleRepository, private readonly permissionRepository: PermissionRepository){}
    async execute(command: AssingPermissionCommand): Promise<any> {
        const { role, action, resource } = command;

        const findRole = await this.roleRepository.findByRoleName(role)
        if(!findRole){
            throw new EntityNotFoundException("role")
        }
        const createPermission = Permission.create(action, resource, '');

        await this.permissionRepository
        await this.roleRepository.assignPermission(findRole, createPermission)
        return Promise.resolve()
    }
}

