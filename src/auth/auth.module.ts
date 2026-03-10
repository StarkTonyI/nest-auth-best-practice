import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { ApiConfigServices } from "src/configService/apiConfig.service";
import { PrismaModule } from "./database/dataBase.module";

@Module({
    providers:[AuthService, ApiConfigServices],
    controllers: [AuthController],
    imports:[PrismaModule]
})
export class AuthModule {}