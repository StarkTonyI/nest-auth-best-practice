import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Inject, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { type iProfileRepository } from "src/core/repositories/profile-repository";
import { type iIdentityRepository } from "src/core/repositories/identity-repository";
import { EntityNotFoundException } from "src/core/exeption/domain-exeptions";
import { LoggerService } from "src/infrastructure/logger/logger.service";
import { DeleteProfileAndUserCommand } from "./impl/delete-auth.command";

@Injectable()
@CommandHandler(DeleteProfileAndUserCommand)
export class DeleteAuthHandler implements ICommandHandler<DeleteProfileAndUserCommand>{
    constructor(
        @Inject('IdentityRepository')
        private readonly authRepo: iIdentityRepository,
        @Inject('IProfileRepository')
        private readonly profileRepo: iProfileRepository,
        private readonly logger: LoggerService
    ){}
    async execute(command: DeleteProfileAndUserCommand): Promise<any> {
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


