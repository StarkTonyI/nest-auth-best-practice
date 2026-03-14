import { Body, Controller, Get, Post, Req } from "@nestjs/common";
import RegisterUserDto from "./dto/registerUser.dto";
import { AuthService } from "./auth.service";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){}
    
    @Get('/hello')
    hello(){
        return { 'Hello there': 'Hey hey everyone' }
    }


    @Post('/register') 
    async register(@Body() req){
        return await this.authService.register(req)
    }




































}











