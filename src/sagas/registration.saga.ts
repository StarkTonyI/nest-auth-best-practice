import { ICommand, ofType, Saga } from "@nestjs/cqrs";
import { map, Observable } from "rxjs";
import { DeleteProfileAndUserEvent } from "src/auth/handler/auth/impl/delete-auth.command";
import { LoggerService } from "src/services/logger.service";
import { CreateProfileHandler } from "src/profile/handler/events/createProfile.events";
import { DeleteProfileEvent } from "src/profile/handler/events/deleteProfile.event";
import { Injectable } from "@nestjs/common";
import { authUserCreatedEvent } from "src/auth/events/auth-user-created.event";
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
            return new DeleteProfileAndUserEvent(event.authId)
        })
    )
}
}







