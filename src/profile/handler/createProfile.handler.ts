import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { CreateProfileHandlerEvent } from "./events/createProfile.events";
import { ProfileDomainService } from "src/domains/profile.domain";
import { Inject } from "@nestjs/common";
import { type iProfileRepository } from "src/interfaces/repository/profile-repository";
import { DeleteProfileEvent } from "./events/deleteProfile.event"

@CommandHandler(CreateProfileHandlerEvent)
export class ProfileCreateHandler implements  ICommandHandler<CreateProfileHandlerEvent>{
    constructor(private readonly domain: ProfileDomainService,
        @Inject('IProfileRepository')
        private readonly profile: iProfileRepository,
        private readonly eventBus: EventBus
    ){}
    async execute(command: CreateProfileHandlerEvent): Promise<any> {
        const { username, lastname, authId } = command;
        this.domain.createProfileEntity({username, lastname, authId})
        let profile;
        try{
            profile = await this.profile.create({
                username, lastname, authId
            })

        }catch(err){
            await this.eventBus.publish(new DeleteProfileEvent(profile.id || '', authId, err))
        }

        return Promise.resolve()
    }
}