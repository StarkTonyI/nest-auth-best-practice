import { Body, Controller, Post, UseGuards } from "@nestjs/common"
import { CommandBus } from "@nestjs/cqrs"
import { AssingPermissionCommand } from "src/application/commands/role/impl/assign-permission.command"
import { CreateRoleCommand } from "src/application/commands/role/impl/createRole.command"
import { AssingPermissionPayload } from "src/application/dtos/request/permission/assignPermission.dto"
import { RolePayload } from "src/application/dtos/request/auth/rolePassword.dto"
import { RefreshJwtGuard } from "src/presentation/guards/refresh.guard"
import { ResponseMessage } from "src/shared/decorator/response-matadata.decorator"

@Controller("role")
export class RoleController {
    constructor(private readonly commandBus: CommandBus){}
    @ResponseMessage("Create role successfully")
    @UseGuards(RefreshJwtGuard)
    @Post('/create-role') 
    async createRole(@Body() rolePayload: RolePayload){
        return this.commandBus.execute(new CreateRoleCommand(
            rolePayload.role, 
            rolePayload.description, 
            rolePayload.permissionName, 
            rolePayload.isDefault 
        ))
    }

    @ResponseMessage("Assign permission to role successfully")
    @UseGuards(RefreshJwtGuard)
    @Post('/assign-permission') 
    async assignPermission(@Body() permissionPayload: AssingPermissionPayload){
        return this.commandBus.execute(new AssingPermissionCommand(
            permissionPayload.role, 
            permissionPayload.action,
            permissionPayload.resource
        ))
    }
}