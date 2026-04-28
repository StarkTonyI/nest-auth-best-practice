import { Inject, Injectable } from "@nestjs/common";
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CommandCreateAuthEvent } from "./impl/create-auth.command";
import { FirstName, LastName } from "src/value-objects/name.vo";
import { Email } from "src/value-objects/email.vo";
import { Password } from "src/value-objects/password.vo";
import { type iIdentityRepository } from "src/interfaces/repository/identity-repository";
import { Identity } from "src/core/entities/Identity.entity";
import { EntityAlreadyExistsException, EntityNotFoundException } from "src/exeption/domain-exeptions";
import { RoleRepository } from "src/infrastructure/repository/role-repository.service";
import { HasherService } from "src/auth/services/HasherService.service";
import { authUserCreatedEvent } from "src/auth/events/auth-user-created.event";

@Injectable()
@CommandHandler(CommandCreateAuthEvent)

export class CreateCommandHandler implements ICommandHandler<CommandCreateAuthEvent> {
    constructor(
        private readonly eventBus: EventBus,
        @Inject("iIdentityRepository")
        private readonly identityRepository: iIdentityRepository,
        private readonly passwordHash: HasherService, 
        private readonly roleRepository: RoleRepository
    ){};

async execute(command: CommandCreateAuthEvent): Promise<any> {
    const { user } = command;

    const firstName = new FirstName(user.firstName);
    const lastName = new LastName(user.lastName);
    const email = new Email(user.email);
    const password = new Password(user.password);
    

    const findUser = await this.identityRepository.findByEmail(email.getValue);
    if (findUser) {
        throw new EntityAlreadyExistsException("User already exist", findUser.getIdValue);
    }

    const hash = await this.passwordHash.hash(password.getValue);

    const validatedUser = Identity.create(email, hash);

    const role = await this.roleRepository.findDefaultRole();

    console.log(role)

    if(!role){
        throw new EntityNotFoundException("Role", "Default role is not exist!")
    }
    
    validatedUser.addRoles(role);

    const userCreated = await this.identityRepository.create(validatedUser);

    userCreated.createNewProfile(firstName, lastName);

    if(!userCreated.getProfile) throw new Error("Profile is not created");
        
    await this.eventBus.publish(new authUserCreatedEvent(userCreated.getProfile));

    return Identity.toDetailResponse(userCreated);

}}






