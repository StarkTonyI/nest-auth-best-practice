import { Inject, Injectable } from "@nestjs/common";
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CommandCreateAuthEvent } from "./events/create-auth.events";
import { authUserCreatedEvent } from "../events/auth-user-created.event";
import { LoggerService } from "../../services/logger.service";
import { FirstName, LastName } from "src/value-objects/name.vo";
import { Email } from "src/value-objects/email.vo";
import { Password } from "src/value-objects/password.vo";
import { type IdentityRepository } from "src/interfaces/repository/identity-repository";
import { passwordHash } from "../services/passwordHash.service";
import { Identity } from "src/core/entities/Identity.entity";
import { Profile } from "src/core/entities/profile.entity";

@Injectable()
@CommandHandler(CommandCreateAuthEvent)

export class CreateCommandHandler implements ICommandHandler<CommandCreateAuthEvent> {
    constructor(
        private readonly eventBus: EventBus,
        private readonly logger: LoggerService,
        @Inject("IIdentityRepository")
        private readonly identityRepository: IdentityRepository,
        private readonly passwordHash: passwordHash
    ){};

async execute(command: CommandCreateAuthEvent): Promise<any> {
    const context = { method: 'Register user', module: "CreateCommandHandler" };
    const { user } = command;

    try {
        const firstName = new FirstName(user.firstName);
        const lastName = new LastName(user.lastName);
        const email = new Email(user.email);
        const password = new Password(user.password);

        this.logger.log(`Registration user started: ${user.email}`, context);

        const findUser = await this.identityRepository.findByEmail(email.getValue(), {});
        if (findUser) {
            this.logger.warn(`User already exists: ${user.email}`, context);
            throw new Error("User already exist");
        }

        const hash = await this.passwordHash.hash(password.getValue);
        this.logger.log(`Password hashed successfully for ${user.email}`, context);

        const validatedUser = Identity.create(email, hash);
        const userCreated = await this.identityRepository.create(validatedUser);
        this.logger.log(`User created with ID: ${validatedUser.userId}`, context);

        const validateProfile = Profile.create({ firstName, lastName, identityId: validatedUser.userId });
        this.eventBus.publish(new authUserCreatedEvent(validateProfile.userName, validateProfile.firstName, validateProfile.lastName, validateProfile.identityId));
        
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