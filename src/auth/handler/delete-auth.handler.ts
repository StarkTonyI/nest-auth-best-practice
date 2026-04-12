import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeleteProfileAndUserEvent } from "./events/delete-auth.events";
import { Inject, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { type iProfileRepository } from "src/interfaces/repository/profile-repository";
import { LoggerService } from "../../services/logger.service";
import { type iIdentityRepository } from "src/interfaces/repository/identity-repository";
import { EntityNotFoundException } from "src/exeption/domain-exeptions";

@Injectable()
@CommandHandler(DeleteProfileAndUserEvent)
export class DeleteAuthHandler implements ICommandHandler<DeleteProfileAndUserEvent>{
    constructor(
        @Inject('IdentityRepository')
        private readonly authRepo: iIdentityRepository,
        @Inject('IProfileRepository')
        private readonly profileRepo: iProfileRepository,
        private readonly logger: LoggerService
    ){}
    async execute(command: DeleteProfileAndUserEvent): Promise<any> {
        const context = { method: 'CreateCommandHandler', module: "method" };
        
        const { authId } = command;

        this.logger.log(`Deleted user started with userID - ${authId}`, context);

        if(!authId) throw new Error('Incorrect data');

        const userExist = this.authRepo.findById(authId.getValue, {})
        if(!userExist){
            throw new EntityNotFoundException('User!', authId.getValue)
        }
        try {
            await this.authRepo.delete(authId.getValue);
            await this.profileRepo.delete(authId.getValue)

        } catch(err){
            this.logger.warn(`Cant delete profile and user with authId: ${authId}`)
            throw new UnauthorizedException({ message: 'Deleted fail', statusCode: 400, error: err })
        }
        

    }
}


