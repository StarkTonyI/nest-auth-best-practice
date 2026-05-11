import { Module } from "@nestjs/common";
import { PrismaService } from "./dataBase.service";
import { ApiConfigModule } from "src/infrastructure/services/configService/apiConfig.module";


@Module({
    providers:[PrismaService],
    imports:[ApiConfigModule],
    exports:[PrismaService]
})
export class PrismaModule {}