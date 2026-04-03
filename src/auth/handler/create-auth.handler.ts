import { ConflictException, Inject, Injectable } from "@nestjs/common";
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CommandCreateAuthEvent } from "./events/create-auth.events";
import { AuthDomainService } from "../../domains/auth.domain";
import { type IUserRepository } from "../../interfaces/repository/auth-repository"
import { authUserCreated } from "../events/auth-user-created.event";
import { LoggerService } from "../../services/logger.service";
import * as bcrypt from 'bcrypt'
import { AuthService } from "../auth.service";
import { UserService } from "src/services/userServices.service";
@Injectable()
@CommandHandler(CommandCreateAuthEvent)

export class CreateCommandHandler implements ICommandHandler<CommandCreateAuthEvent> {
    constructor(
        @Inject('IUserRepository')
        private readonly authRepo: IUserRepository,
        private readonly eventBus: EventBus,
        private readonly logger: LoggerService,
        private readonly userService: UserService
    ){};

   async execute(command: CommandCreateAuthEvent): Promise<any> {
    const context = { method: 'Register user', module: "CreateCommandHandler" };
    const { user } = command;

    this.logger.log(`Registration user started: ${user.email}`, context);

    const userCreated = await this.userService.create(user)

    this.eventBus.publish(new authUserCreated(userCreated.userFirstName.getValue(), userCreated.userLastName.getValue(), userCreated.userId.getValue() ))

    return userCreated;
   }
}