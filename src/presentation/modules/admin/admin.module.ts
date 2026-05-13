import { Module } from "@nestjs/common";
import { PermissionRepository } from "src/infrastructure/repository/permission-repository.service";
import { RoleRepository } from "src/infrastructure/repository/role-repository.service"
import { PrismaModule } from "src/infrastructure/database/dataBase.module";
import { CreateRoleHandler } from "src/application/commands/role/createRole.handler";
import { AssingPermissionHandler } from "src/application/commands/role/assign-permission.handler";
import { CqrsModule } from "@nestjs/cqrs";
import { AdminAuthController } from "./admin-auth.controller";
import { AdminHealthController } from "./admin.health.controller";
import { JwtModule, JwtService } from "@nestjs/jwt";
import { ApiConfigServices } from "src/infrastructure/services/configService/apiConfig.service";
import { ConfigService } from "@nestjs/config";
import { GetLivenessQueryHandler } from "src/application/queries/health/get-liveness.query";
import { GetDataBaseStatusQueryHandler } from "src/application/queries/health/get-databaseStatus.query";

@Module({
    providers:[
        RoleRepository, PermissionRepository,
        CreateRoleHandler, AssingPermissionHandler, JwtService,
        ApiConfigServices, ConfigService, GetLivenessQueryHandler, GetDataBaseStatusQueryHandler,
    ],
    controllers: [AdminAuthController, AdminHealthController],
    imports:[PrismaModule, CqrsModule, JwtModule],
    exports:[RoleRepository, PermissionRepository]
})
export default class AdminModule {}

