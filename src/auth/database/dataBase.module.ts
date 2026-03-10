import { Module } from "@nestjs/common";
import { PrismaService } from "./dataBase.service";

Module({
    providers:[PrismaService],
    exports:[PrismaService]
})
export class PrismaModule {}