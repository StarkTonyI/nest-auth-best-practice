import { Body, Controller, Get, Post, Req, Request, Response, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { TokenMetaData } from "./decorator/metaData/tokens.decorator";
import { JwtGuard } from "./guards/jwt.guard";
import { ResponseService } from "src/service/response/response.service";
import { ResponseMessage } from "src/decorator/response-matadata.dto";
import { RawToken } from "./decorator/rawToken.decorator";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService, private readonly response: ResponseService){}
    @TokenMetaData("access")
    @UseGuards(JwtGuard)
    @Get('/hello')
    hello(){
        return { 'Hello there': 'Hey hey everyone' }
    }

    @ResponseMessage("Register user success")
    @Post('/register') 
    async register(@Body() register, @Response({passthrough: true}) res){
        
        return await this.authService.register(register, res)
       
    }

    @ResponseMessage("Login user successfully")
    @Post('/login') 
    async login(@Body() login, @Response({passthrough: true}) res){
         const user = await this.authService.login(login, res)
        return user
}
    @TokenMetaData("refresh")
    @UseGuards(JwtGuard)
    @ResponseMessage("Tokens updated succesfully")
    @Post('/refresh-token') 
    async refreshToken(@Request() req, @RawToken('token') token: string){
        return await this.authService.refreshToken(req, token)
    
    }
}











