import { Module } from "@nestjs/common";
import { CqrsModule } from "@nestjs/cqrs";
import { RegistrationSaga } from "src/presentation/sagas/registration.saga";
import { ProfileRepository } from "src/infrastructure/repository/profile-repository.service";
import { PrismaModule } from "src/infrastructure/database/dataBase.module";
import { IdentityRepository } from "src/infrastructure/repository/identity-repository.service";
import { ProfileCreateHandler } from "src/application/commands/profile/createProfile.handler";

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

