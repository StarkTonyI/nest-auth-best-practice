import { Body, Controller, Get,  Post,  UseGuards } from "@nestjs/common";
import { TokenMetaData } from "./decorator/metaData/tokens.decorator";
import { RefreshJwtGuard } from "./guards/refresh.guard";
import { ResponseMessage } from "src/decorator/response-matadata.dto";
import { RawToken } from "./decorator/rawToken.decorator";
import { AccessJwtGuard } from "./guards/access.guard";
import { CommandBus } from "@nestjs/cqrs";
import { CommandCreateAuthEvent } from "./handler/events/create-auth.events";
import { RefreshTokenEvent } from "./handler/events/refresh-token.event";
import { LoginEvent } from "./handler/events/login-auth.event";

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
    @UseGuards(RefreshJwtGuard)
    @ResponseMessage("Tokens updated succesfully")
    @Post('/refresh-token') 
    async refreshToken(@RawToken() token: string){
        return this.commandBus.execute(new RefreshTokenEvent(token))
    
    }
}











