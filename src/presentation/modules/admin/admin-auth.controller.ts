import { Body, Controller, Post, UseGuards } from "@nestjs/common"
import { CommandBus } from "@nestjs/cqrs"
import { LoginCommand } from "src/application/commands/auth/impl/login-auth.command"
import { RefreshTokenCommand } from "src/application/commands/auth/impl/refresh-token.command"
import { RefreshJwtGuard } from "src/presentation/guards/refresh.guard"
import { RawToken } from "src/shared/decorator/rawToken.decorator"
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

}