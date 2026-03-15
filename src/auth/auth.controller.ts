import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import RegisterUserDto from "./dto/registerUser.dto";
import { AuthService } from "./auth.service";
import { TokenMetaData } from "./decorator/metaData/tokens.decorator";
import { JwtStrategy } from "./guards/passport.guard";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){}
    @TokenMetaData("access")
    @UseGuards(JwtStrategy)
    @Get('/hello')
    hello(){
        return { 'Hello there': 'Hey hey everyone' }
    }

    
    @Post('/register') 
    async register(@Body() req){
        return await this.authService.register(req)
    }




































}











