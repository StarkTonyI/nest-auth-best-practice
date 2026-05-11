import { Inject, Injectable } from "@nestjs/common";
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { FirstName, LastName } from "src/core/value-objects/name.vo";
import { Email } from "src/core/value-objects/email.vo";
import { Password } from "src/core/value-objects/password.vo";
import { type iIdentityRepository } from "src/core/repositories/identity-repository";
import { Identity } from "src/core/entities/Identity.entity";
import { EntityAlreadyExistsException, EntityNotFoundException } from "src/core/exeption/domain-exeptions";
import { RoleRepository } from "src/infrastructure/repository/role-repository.service";
import { HasherService } from "src/infrastructure/services/hasherSerive/hasherService.service";
import { authUserCreatedEvent } from "src/application/commands/auth/events/auth-user-created.event";
import { RegisterCommand } from "./impl/register-auth.command";

@Injectable()
@CommandHandler(RegisterCommand)
export class RegisterCommandHandler implements ICommandHandler<RegisterCommand> {
    constructor(
        private readonly eventBus: EventBus,
        @Inject("iIdentityRepository")
        private readonly identityRepository: iIdentityRepository,
        private readonly passwordHash: HasherService, 
        private readonly roleRepository: RoleRepository
    ){};

async execute(command: RegisterCommand): Promise<any> {
    const { user } = command;

    const firstName = new FirstName(user.firstName);
    const lastName = new LastName(user.lastName);
    const email = new Email(user.email);
    const password = new Password(user.password);
    

    const findUser = await this.identityRepository.findByEmail(email.value);
    if (findUser) {
        throw new EntityAlreadyExistsException("User already exist", findUser.id.value);
    }
    const hash = await this.passwordHash.hash(password.value);
    const validatedUser = Identity.create(email, hash);
    const role = await this.roleRepository.findDefaultRole();

    if(!role){
        throw new EntityNotFoundException("Role", "Default role is not exist!")
    }
    
    validatedUser.addRoles(role);
    const userCreated = await this.identityRepository.create(validatedUser);

    userCreated.createNewProfile(firstName, lastName);

    if(!userCreated.profile) throw new Error("Profile is not created");
        
    await this.eventBus.publish(new authUserCreatedEvent(userCreated.profile));

    return Identity.toDetailResponse(userCreated);
}}








