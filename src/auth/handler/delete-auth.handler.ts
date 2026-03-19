import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { DeleteProfileAndUserEvent } from "./events/delete-auth.events";
import { Inject, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { type IAuthRepository } from "src/interfaces/repository/auth-repository";
import { type iProfileRepository } from "src/interfaces/repository/profile-repository";

@Injectable()
@CommandHandler(DeleteProfileAndUserEvent)
export class DeleteAuthHandler implements ICommandHandler<DeleteProfileAndUserEvent>{
    constructor(
        @Inject('IAuthRepository')
        private readonly authRepo: IAuthRepository,
        @Inject('IProfileRepository')
        private readonly profileRepo: iProfileRepository
    ){}
    async execute(command: DeleteProfileAndUserEvent): Promise<any> {
        const { id, authId } = command;
        if(!id && !authId) throw new Error('Incorrect data');

        const userExist = this.authRepo.findById(id)
        if(!userExist){
            throw new NotFoundException('User dont exist!')
        }
        
        try {
            await this.authRepo.delete(authId);
            await this.profileRepo.delete(id)
        }catch(err){
            throw new UnauthorizedException({ message: 'Deleted fail', statusCode: 400, error: err })
        }
        

    }
}