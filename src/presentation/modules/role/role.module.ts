import { Module } from "@nestjs/common";
import { PermissionRepository } from "src/infrastructure/repository/permission-repository.service";
import { RoleRepository } from "src/infrastructure/repository/role-repository.service";
import { RoleController } from "./role.controller";
import { PrismaModule } from "src/infrastructure/database/dataBase.module";
import { CreateRoleHandler } from "src/application/commands/role/createRole.handler";
import { AssingPermissionHandler } from "src/application/commands/role/assign-permission.handler";
import { CqrsModule } from "@nestjs/cqrs";

@Module({
    providers:[RoleRepository, PermissionRepository, CreateRoleHandler, AssingPermissionHandler],
    controllers: [RoleController],
    imports:[PrismaModule, CqrsModule],
    exports:[RoleRepository, PermissionRepository]
})
export default class RoleModule {}