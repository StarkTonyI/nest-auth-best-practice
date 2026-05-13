import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common"
import { CommandBus } from "@nestjs/cqrs"
import { LoginCommand } from "src/application/commands/auth/impl/login-auth.command"
import { LogoutCommand } from "src/application/commands/auth/impl/logout-auth.command"
import { RefreshTokenCommand } from "src/application/commands/auth/impl/refresh-token.command"
import { AccessJwtGuard } from "src/presentation/guards/access.guard"
import { RefreshJwtGuard } from "src/presentation/guards/refresh.guard"
import { RawToken } from "src/shared/decorator/rawToken.decorator"
import { ReqUser } from "src/shared/decorator/reqUser.decorator"
import { ResponseMessage } from "src/shared/decorator/response-matadata.decorator"

@Controller("admin")
export class AdminAuthController {
    constructor(private readonly commandBus: CommandBus){}

    @ResponseMessage("Login user successfully")
    @Post('/login') 
    async login(@Body() login){
        return this.commandBus.execute(new LoginCommand(login))
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