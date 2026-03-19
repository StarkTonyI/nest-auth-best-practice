import { Module } from "@nestjs/common";
import { ProfileController } from "./profile.controller";
import { CqrsModule } from "@nestjs/cqrs";
import { ProfileCreateHandler } from "./handler/createProfile.handler";
import { RegistrationSaga } from "src/sagas/registration.saga";
import { ProfileService } from "./profile.service";
import { ProfileDomainService } from "src/domains/profile.domain";
import { ProfileRepository } from "src/infrastructure/repository/profile-repository.service";
import { PrismaModule } from "src/database/dataBase.module";

const commandHandlers = [ProfileCreateHandler]
const sagas = [RegistrationSaga]

@Module({
    providers:[
        ProfileService,
        ProfileDomainService,
        {
            provide: 'IProfileRepository',
            useClass: ProfileRepository
        }, 
        ...commandHandlers,
        ...sagas
    ],
    exports:[ProfileService, ProfileDomainService, 'IProfileRepository'],
    imports:[CqrsModule, PrismaModule]
})
export class ProfileModule {};

