import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeleteProfileAndUserEvent } from "./impl/delete-auth.command";
import { Inject, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { type iProfileRepository } from "src/interfaces/repository/profile-repository";
import { type iIdentityRepository } from "src/interfaces/repository/identity-repository";
import { EntityNotFoundException } from "src/exeption/domain-exeptions";
import { LoggerService } from "src/services/logger.service";

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

        const userExist = this.authRepo.findById(authId.value)
        if(!userExist){
            throw new EntityNotFoundException('User!', authId.value)
        }
        try {
            await this.authRepo.delete(authId.value);
            await this.profileRepo.delete(authId.value)

        } catch(err){
            this.logger.warn(`Cant delete profile and user with authId: ${authId}`)
            throw new UnauthorizedException({ message: 'Deleted fail', statusCode: 400, error: err })
        }
        

    }
}


