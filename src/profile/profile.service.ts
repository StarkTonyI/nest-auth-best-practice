import { Inject, UnauthorizedException } from "@nestjs/common";
import { privateDecrypt } from "crypto";
import { ProfileRepository } from "src/infrastructure/repository/profile-repository.service";
import { UserId } from "src/value-objects/userid.vo";

export class ProfileService {
    constructor(
        @Inject("IUserRepository")
        private readonly profileRepository: ProfileRepository
    ){}

    async validateProfile(userId: UserId){
        const profile = await this.profileRepository.findByAuthId(userId.getValue())
        if(!profile){
            throw new UnauthorizedException('Profile not exist by user')
        }
        return profile;

    }
}