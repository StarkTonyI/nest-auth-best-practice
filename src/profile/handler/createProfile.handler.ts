import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { Inject } from "@nestjs/common";
import { type iProfileRepository } from "src/interfaces/repository/profile-repository";
import { DeleteProfileEvent } from "./events/deleteProfile.event"
import { LoggerService } from "src/services/logger.service";
import { CreateProfileHandler } from "./events/createProfile.events";

@CommandHandler(CreateProfileHandler)
export class ProfileCreateHandler implements  ICommandHandler<CreateProfileHandler>{
    constructor(
        @Inject('IProfileRepository')
        private readonly profileRepository: iProfileRepository,
        private readonly eventBus: EventBus,
        private readonly logger: LoggerService
    ){}
    async execute(command: CreateProfileHandler): Promise<any> {
        const context = { method: "ProfileCreateHandler", module: "execute" }
        const { userName, firstName, lastName, identityId } = command.profile;
        this.logger.log(`Creation profile with authId - ${identityId} started...`, context)
        let profile:any;
        try {
            profile = await this.profileRepository.create({ userName, firstName, lastName, authId:identityId })
            this.logger.log(`Profile successfully created with id - ${profile.id}`)
        }catch(err){
            const message = err instanceof Error ? err.message : String(err)
            this.logger.warn(`Profile creation failed, with user - ${identityId} cause: ${message}`)
            await this.eventBus.publish(new DeleteProfileEvent(identityId, message))
        }

        return Promise.resolve()
    }
}