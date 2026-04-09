import { Injectable } from "@nestjs/common";
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CommandCreateAuthEvent } from "./events/create-auth.events";
import { authUserCreatedEvent } from "../events/auth-user-created.event";
import { LoggerService } from "../../services/logger.service";
import { IdentityService } from "../identity.service";
import { useContainer } from "class-validator";

@Injectable()
@CommandHandler(CommandCreateAuthEvent)

export class CreateCommandHandler implements ICommandHandler<CommandCreateAuthEvent> {
    constructor(
        private readonly eventBus: EventBus,
        private readonly logger: LoggerService,
        private readonly identityService: IdentityService
    ){};

   async execute(command: CommandCreateAuthEvent): Promise<any> {
    const context = { method: 'Register user', module: "CreateCommandHandler" };
    const { user } = command;

    await this.identityService.validateUser(user.email, user.password)

    this.logger.log(`Registration user started: ${user.email}`, context);

    const userCreated = await this.identityService.create(user)

    this.eventBus.publish(new authUserCreatedEvent(userCreated.userName, userCreated.firstName, userCreated.lastName, userCreated.identityId))

    return userCreated;
   }
}