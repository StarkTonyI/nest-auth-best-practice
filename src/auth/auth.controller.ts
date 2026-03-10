import { Controller, Get, Post } from "@nestjs/common";

@Controller('auth')
export class AuthController {
    constructor(){}
    
    @Get('/hello')
    hello(){
        return { 'Hello there': 'Hey hey everyone' }
    }


    @Post('/register') 
    register(){
        
    }




































}











