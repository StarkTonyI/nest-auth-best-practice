import { Body, Controller, Get,  Post,  UseGuards } from "@nestjs/common";
import { TokenMetaData } from "./decorator/metaData/tokens.decorator";
import { RefreshJwtGuard } from "./guards/refresh.guard";
import { ResponseMessage } from "src/decorator/response-matadata.dto";
import { RawToken } from "./decorator/rawToken.decorator";
import { AccessJwtGuard } from "./guards/access.guard";
import { CommandBus } from "@nestjs/cqrs";
import { CommandCreateAuthEvent } from "./handler/auth/impl/create-auth.command";
import { RefreshTokenEvent } from "./handler/auth/impl/refresh-token.command";
import { LoginEvent } from "./handler/auth/impl/login-auth.command";
import { ReqUser } from "./decorator/reqUser.decorator";
import { ChangePasswordDto } from "src/dto/request/auth/changePassword.dto";
import { ResponseInterceptor } from "src/interceptor/response.interceptor";
import { ChangePasswordCommand } from "./handler/auth/impl/change-passwrod.command";
import { RolePayload } from "src/dto/request/auth/rolePassword.dto";
import { CreateRoleHandler } from "./handler/role/createRole.handler";
import { CreateRoleCommand } from "./handler/role/impl/createRole.command";

@Controller('auth')
export class AuthController {
    constructor(private readonly commandBus: CommandBus){}
    @TokenMetaData("access")
    @UseGuards(AccessJwtGuard)
    @Get('/hello')
    hello(){
        return { 'Hello there': 'Hey hey everyone' }
    }

    @ResponseMessage("Register user success")
    @Post('/register') 
    async register(@Body() register){
        return this.commandBus.execute(new CommandCreateAuthEvent(register))
    }

    @ResponseMessage("Login user successfully")
    @Post('/login') 
    async login(@Body() login){
        return this.commandBus.execute(new LoginEvent(login))
}

    
    @ResponseMessage("Password reset successfully")
    @Post("/change-password")
    async changePassword(@Body() passwordPayload: ChangePasswordDto, @ReqUser("id") id){
        return this.commandBus.execute(new ChangePasswordCommand(id, passwordPayload.newPassword, passwordPayload.oldPassword))
    }


    @UseGuards(RefreshJwtGuard)
    @ResponseMessage("Tokens updated succesfully")
    @Post('/refresh-token') 
    async refreshToken(@RawToken() token: string){
        return this.commandBus.execute(new RefreshTokenEvent(token))
    
    }

    
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



}











