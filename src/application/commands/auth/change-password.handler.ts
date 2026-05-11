import { CommandHandler, ICommandBus, ICommandHandler } from "@nestjs/cqrs";
import { ChangePasswordCommand } from "./impl/change-passwrod.command";

@CommandHandler(ChangePasswordCommand)
export class ChangePasswordCommandHandler implements ICommandHandler<ChangePasswordCommand>{
    execute(command: ChangePasswordCommand): Promise<boolean> {
        const { userId, newPassword, oldPassword} = command;







        return Promise.resolve(true);
    }
}

