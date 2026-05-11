import { Body, Controller, Get, Injectable, Post, UseGuards } from "@nestjs/common"
import { CommandBus } from "@nestjs/cqrs"
import { ChangePasswordCommand } from "src/application/commands/auth/impl/change-passwrod.command"
import { LoginCommand } from "src/application/commands/auth/impl/login-auth.command"
import { LogoutCommand } from "src/application/commands/auth/impl/logout-auth.command"
import { RefreshTokenCommand } from "src/application/commands/auth/impl/refresh-token.command"
import {  RegisterCommand } from "src/application/commands/auth/impl/register-auth.command"
import { ChangePasswordDto } from "src/application/dtos/request/auth/change-password.dto"
import { AccessJwtGuard } from "src/presentation/guards/access.guard"
import { RefreshJwtGuard } from "src/presentation/guards/refresh.guard"
import { RawToken } from "src/shared/decorator/rawToken.decorator"
import { ReqUser } from "src/shared/decorator/reqUser.decorator"
import { ResponseMessage } from "src/shared/decorator/response-matadata.decorator"
import { TokenMetaData } from "src/shared/decorator/tokens.decorator"
@Injectable()
@Controller('auth')
export class AuthController {
    constructor(private readonly commandBus: CommandBus){}
    @TokenMetaData("access")
    @UseGuards(AccessJwtGuard)

    @ResponseMessage("Register user success")
    @Post('/register') 
    async register(@Body() register){
        return this.commandBus.execute(new RegisterCommand(register))
    }

    @ResponseMessage("Login user successfully")
    @Post('/login') 
    async login(@Body() login){
        return this.commandBus.execute(new LoginCommand(login))
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
        return this.commandBus.execute(new RefreshTokenCommand(token))
    
    }
    @UseGuards(AccessJwtGuard)
    @ResponseMessage("Logout user succesfully")
    @Get('/logout') 
    async logout(@ReqUser("id") id){
        return this.commandBus.execute(new LogoutCommand(id))
}


}











