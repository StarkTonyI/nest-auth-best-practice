import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { CreateProfileHandlerEvent } from "./events/createProfile.events";
import { ProfileDomainService } from "src/domains/profile.domain";
import { Inject } from "@nestjs/common";
import { type iProfileRepository } from "src/interfaces/repository/profile-repository";
import { DeleteProfileEvent } from "./events/deleteProfile.event"
import { LoggerService } from "src/auth/services/logger.service";

@CommandHandler(CreateProfileHandlerEvent)
export class ProfileCreateHandler implements  ICommandHandler<CreateProfileHandlerEvent>{
    constructor(private readonly domain: ProfileDomainService,
        @Inject('IProfileRepository')
        private readonly profile: iProfileRepository,
        private readonly eventBus: EventBus,
        private readonly logger: LoggerService
    ){}
    async execute(command: CreateProfileHandlerEvent): Promise<any> {
        const context = { method: "ProfileCreateHandler", module: "execute" }
        const { username, lastname, authId } = command;

        this.logger.log(`Creation profile with authId - ${authId} started...`, context)

        this.domain.createProfileEntity({username, lastname, authId})
        let profile:any;

        try {
            profile = await this.profile.create({
                username, lastname, authId
            })
            this.logger.log(`Profile successfully created with id - ${profile.id}`)
        }catch(err){
            this.logger.warn(`Profile creation failed, with user - ${authId} cause: ${err.message}`)
            await this.eventBus.publish(new DeleteProfileEvent(authId, err))
        }

        return Promise.resolve()
    }
}