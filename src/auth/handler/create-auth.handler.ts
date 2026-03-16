import { ConflictException, Inject, Injectable } from "@nestjs/common";
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { CommandCreateAuthEvent } from "./events/create-auth.events";
import { AuthDomainService } from "../domains/auth.domain";
import { type IAuthRepository } from "../domains/interfaces/authRepository.interface";
import { CreateEventBus } from "../events/created-auth-event.event";
@Injectable()
@CommandHandler(CommandCreateAuthEvent)

export class CreateCommandHandler implements ICommandHandler<CommandCreateAuthEvent> {
    constructor(private readonly domain: AuthDomainService,
        @Inject('IAuthRepository')
        private readonly authRepo: IAuthRepository,
        private readonly eventBus: EventBus
    ){};
   async execute(command: CommandCreateAuthEvent): Promise<any> {
    const { registerUser } = command;
    const { username, email, password, role } = registerUser;
    this.domain.isUserCorrect(email, password)
    const userExist = await this.authRepo.findByEmail(email);
    if(userExist){
        throw new ConflictException('User already exist!')  
    }
    const { id} = await this.authRepo.create(registerUser)
    this.eventBus.publish(new CreateEventBus(id, username, email, password, role))
    
   }
}