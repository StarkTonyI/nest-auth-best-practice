import { Inject, Injectable } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { LogoutCommand } from "./impl/logout-auth.command";
import { type iIdentityRepository } from "src/core/repositories/identity-repository";
import { EntityNotFoundException } from "src/core/exeption/domain-exeptions";
import { type iSessionRepository } from "src/core/repositories/sessoin-repository";
import { Session } from "src/core/entities/session.entity";

@Injectable()
@CommandHandler(LogoutCommand)
export class LogoutAuthHandler implements ICommandHandler<LogoutCommand>{
    constructor(
        @Inject('iIdentityRepository')
        private readonly identityRepository: iIdentityRepository,
        @Inject('iSessionRepository')
        private readonly sessionRepository: iSessionRepository
        
    ){};
    async execute(command: LogoutCommand): Promise<void> {
        const { id } = command;
        const findUser = await this.identityRepository.findById(id)
        if(!findUser){
            throw new EntityNotFoundException("Identity")
        }

        await this.sessionRepository.deleteSessionById(id)
    }
}