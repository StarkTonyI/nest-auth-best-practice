import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { ProfileCreateHandler } from "./handler/createProfile.handler";
import { RegistrationSaga } from "src/sagas/registration.saga";
import { ProfileRepository } from "src/infrastructure/repository/profile-repository.service";
import { PrismaModule } from "src/database/dataBase.module";
import { IdentityRepository } from "src/infrastructure/repository/identity-repository.service";

const commandHandlers = [ProfileCreateHandler]
const sagas = [RegistrationSaga]

@Module({
    providers:[
        {
            provide: 'IProfileRepository',
            useClass: ProfileRepository
        }, 
        ...commandHandlers,
        ...sagas, 
        {
            provide: 'iIdentityRepository',
            useClass: IdentityRepository
        },
    ],
    exports:[],
    imports:[CqrsModule, PrismaModule, ProfileModule]
})
export class ProfileModule {};

