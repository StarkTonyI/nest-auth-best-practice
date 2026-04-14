import { ConflictException, Inject, Injectable } from "@nestjs/common";
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CommandCreateAuthEvent } from "./events/create-auth.events";
import { authUserCreatedEvent } from "../events/auth-user-created.event";
import { LoggerService } from "../../services/logger.service";
import { FirstName, LastName } from "src/value-objects/name.vo";
import { Email } from "src/value-objects/email.vo";
import { Password } from "src/value-objects/password.vo";
import { type iIdentityRepository } from "src/interfaces/repository/identity-repository";
import { HasherService } from "../services/HasherService.service";
import { Identity } from "src/core/entities/Identity.entity";
import { EntityAlreadyExistsException } from "src/exeption/domain-exeptions";

@Injectable()
@CommandHandler(CommandCreateAuthEvent)

export class CreateCommandHandler implements ICommandHandler<CommandCreateAuthEvent> {
    constructor(
        private readonly eventBus: EventBus,
        @Inject("iIdentityRepository")
        private readonly identityRepository: iIdentityRepository,
        private readonly passwordHash: HasherService
    ){};

async execute(command: CommandCreateAuthEvent): Promise<any> {
    const { user } = command;

    const firstName = new FirstName(user.firstName);
    const lastName = new LastName(user.lastName);
    const email = new Email(user.email);
    const password = new Password(user.password);
    

    const findUser = await this.identityRepository.findByEmail(email.getValue, {});
    if (findUser) {
        throw new EntityAlreadyExistsException("User already exist", findUser.identityIdValue);
    }

    const hash = await this.passwordHash.hash(password.getValue);

    const validatedUser = Identity.create(email, hash);
    const userCreated = await this.identityRepository.create(validatedUser);

    userCreated.createNewProfile(firstName, lastName);

    if(!userCreated.getProfile) throw new Error("Profile is not created");
        
    this.eventBus.publish(new authUserCreatedEvent(userCreated.getProfile));
        

    return userCreated;
    
}
}