import { Controller, Get, Inject, UseGuards } from "@nestjs/common";
import { ResponseService } from "src/infrastructure/services/response/response.service";
import { type iProfileRepository } from "src/core/repositories/profile-repository";
import { ReqUser } from "src/shared/decorator/reqUser.decorator";
import { AccessJwtGuard } from "src/presentation/guards/access.guard";

@Controller('profile')
export class ProfileController {
    constructor(
        @Inject('IProfileRepository')
        private readonly profileService: iProfileRepository,
        private readonly response: ResponseService){}

    @UseGuards(AccessJwtGuard)
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



