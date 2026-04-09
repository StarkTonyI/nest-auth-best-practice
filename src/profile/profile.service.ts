import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { createProfilePayload } from "src/dto/request/profile/profile.dto";
import { ProfileRepository } from "src/infrastructure/repository/profile-repository.service";
import { UserId } from "src/value-objects/userid.vo";
@Injectable()
export class ProfileService {
    constructor(
        @Inject("IProfileRepository")
        private readonly profileRepository: ProfileRepository
    ){}



    create(createProfile: createProfilePayload){
        
    }


    async validateProfile(userId: UserId){
        const profile = await this.profileRepository.findByAuthId(userId.getValue())
        if(!profile){
            throw new UnauthorizedException('Profile not exist by user')
        }
        return profile;

    }
}