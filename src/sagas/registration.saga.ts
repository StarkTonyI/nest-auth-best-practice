import { ICommand, ofType, Saga } from "@nestjs/cqrs";
import { map, Observable } from "rxjs";
import { authUserCreated } from "src/auth/events/auth-user-created.event";
import { DeleteProfileAndUserEvent } from "src/auth/handler/events/delete-auth.events";
import { LoggerService } from "src/auth/services/logger.service";
import { CreateProfileHandlerEvent } from "src/profile/handler/events/createProfile.events";
import { DeleteProfileEvent } from "src/profile/handler/events/deleteProfile.event";

export class RegistrationSaga {
    constructor(private readonly logger: LoggerService){}
@Saga()
userCreated = (events$:Observable<any>): Observable<ICommand> => {
    return events$.pipe(
        ofType(authUserCreated),
        map((event) => {
            this.logger.log(`Started create profile with authId: ${event.authId}`)
            return new CreateProfileHandlerEvent(event.username, event.lastname, event.authId)
        })
    )
}
@Saga()
profileCreated = (events$: Observable<any>):Observable<ICommand> => {
    return events$.pipe(
        ofType(DeleteProfileEvent),
        map((event)=> {
            this.logger.log(`Started deleted profile with authId: ${event.authId}`)
            return new DeleteProfileAndUserEvent(event.authId)
        })
    )
}
}







