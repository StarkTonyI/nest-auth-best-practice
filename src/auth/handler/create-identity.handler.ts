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
import { Profile } from "src/core/entities/profile.entity";
import { useContainer } from "class-validator";

@Injectable()
@CommandHandler(CommandCreateAuthEvent)

export class CreateCommandHandler implements ICommandHandler<CommandCreateAuthEvent> {
    constructor(
        private readonly eventBus: EventBus,
        private readonly logger: LoggerService,
        @Inject("iIdentityRepository")
        private readonly identityRepository: iIdentityRepository,
        private readonly passwordHash: HasherService
    ){};

async execute(command: CommandCreateAuthEvent): Promise<any> {
    const context = { method: 'Register user', module: "CreateCommandHandler" };
    const { user } = command;

    
    const firstName = new FirstName(user.firstName);
    const lastName = new LastName(user.lastName);
    const email = new Email(user.email);
    const password = new Password(user.password);

    this.logger.log(`Registration user started: ${user.email}`, context);

    const findUser = await this.identityRepository.findByEmail(email.getValue(), {});
    if (findUser) {
        this.logger.warn(`User already exists: ${user.email}`, context);
        throw new ConflictException("User already exist");
    }

    try {
        const hash = await this.passwordHash.hash(password.getValue);
        this.logger.log(`Password hashed successfully for ${user.email}`, context);

        const validatedUser = Identity.create(email, hash);
        const userCreated = await this.identityRepository.create(validatedUser);
        this.logger.log(`User created with ID: ${validatedUser.userId}`, context);
        userCreated.createNewProfile(firstName, lastName);
        if(!userCreated.getProfile) throw new Error("Profile is not created");
        
        this.eventBus.publish(new authUserCreatedEvent(userCreated.getProfile));
        
        this.logger.log(`Registration user completed: ${user.email}`, context);
        return userCreated;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        const errorStack = error instanceof Error ? error.stack : '';
        this.logger.error(`Registration failed: ${errorMessage}`, errorStack, context);
        throw error;
    }
}
}