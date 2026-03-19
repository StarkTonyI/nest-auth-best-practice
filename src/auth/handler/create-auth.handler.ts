import { ConflictException, Inject, Injectable } from "@nestjs/common";
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CommandCreateAuthEvent } from "./events/create-auth.events";
import { AuthDomainService } from "../../domains/auth.domain";
import { type IAuthRepository } from "../../interfaces/repository/auth-repository"
import { authUserCreated } from "../events/auth-user-created.event";
import { LoggerService } from "../services/logger.service";
@Injectable()
@CommandHandler(CommandCreateAuthEvent)

export class CreateCommandHandler implements ICommandHandler<CommandCreateAuthEvent> {
    constructor(private readonly domain: AuthDomainService,
        @Inject('IAuthRepository')
        private readonly authRepo: IAuthRepository,
        private readonly eventBus: EventBus,
        private readonly logger: LoggerService
    ){};
   async execute(command: CommandCreateAuthEvent): Promise<any> {
    const context = { method: 'CreateCommandHandler', module: "method" };
    const { registerUser } = command;
    const { username, email, password, lastname } = registerUser;

    this.logger.log(`Registration user started: ${email}`, context);

    this.domain.isUserCorrect(email, password)

    const userExist = await this.authRepo.findByEmail(email);

    if(userExist){
        this.logger.warning(`Registraion failed - user already exist: ${email}`, context)
        throw new ConflictException("User already exist!")  
    }

    const { id } = await this.authRepo.create(registerUser)

    this.logger.log(`User successfull exist with ID - ${id}`)
    
    this.eventBus.publish(new authUserCreated(username, lastname, id))
   }
}