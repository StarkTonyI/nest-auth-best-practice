import { Module } from "@nestjs/common";
import { PrismaService } from "./dataBase.service";
import { ApiConfigModule } from "src/configService/apiConfig.module";


@Module({
    providers:[PrismaService],
    imports:[ApiConfigModule],
    exports:[PrismaService]
})
export class PrismaModule {}