import { Controller, Get, Inject, UseGuards } from "@nestjs/common";
import { ResponseService } from "src/service/response/response.service";
import { type iProfileRepository } from "src/interfaces/repository/profile-repository";
import { JwtGuard } from "src/auth/guards/jwt.guard";
import { ReqUser } from "src/auth/decorator/reqUser.decorator";

@Controller('profile')
export class ProfileController {
    constructor(
        @Inject('IProfileRepository')
        private readonly profileService: iProfileRepository,
        private readonly response: ResponseService){}

    @UseGuards(JwtGuard)
    @Get('/hello')
    hello(){
        return { 'Hello there': 'Hey hey everyone' }
    }

    @Get(':id') 
    async getByIdProfile(@ReqUser('id') authId: string){
        const profile = await this.profileService.findByAuthId(authId)
        return profile;
    }

}



