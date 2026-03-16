import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { TokenMetaData } from "./decorator/metaData/tokens.decorator";
import { JwtGuard } from "./guards/jwt.guard";
import { ResponseService } from "src/service/response/response.service";
import { ResponseMessage } from "src/decorator/response-matadata.dto";

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
    async register(@Body() req){
         const user = await this.authService.register(req)
        return user
    }




































}











