import { ICommand, ofType, Saga } from "@nestjs/cqrs";
import { map, Observable } from "rxjs";
import { LoggerService } from "src/infrastructure/logger/logger.service";
import { CreateProfileHandler } from "src/application/commands/profile/events/createProfile.events";
import { DeleteProfileEvent } from "src/application/commands/profile/events/deleteProfile.event";
import { Injectable } from "@nestjs/common";
import { authUserCreatedEvent } from "src/application/commands/auth/events/auth-user-created.event";
import { DeleteProfileAndUserCommand } from "src/application/commands/auth/impl/delete-auth.command";
@Injectable()
export class RegistrationSaga {
    constructor(private readonly logger: LoggerService){}
@Saga()
userCreated = (events$:Observable<any>): Observable<ICommand> => {
    return events$.pipe(
        ofType(authUserCreatedEvent),
        map((event) => {
            this.logger.log(`Started create profile with authId: ${event.profile.identityId}`)
            return new CreateProfileHandler(event.profile)
        })
    )
}
@Saga()
profileCreated = (events$: Observable<any>):Observable<ICommand> => {
    return events$.pipe(
        ofType(DeleteProfileEvent),
        map((event)=> {
            this.logger.log(`Started deleted profile with authId: ${event.authId}`)
            return new DeleteProfileAndUserCommand(event.authId)
        })
    )
}
}







