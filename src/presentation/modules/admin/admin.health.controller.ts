import { Controller, Get, Post, UseGuards } from "@nestjs/common"
import {  QueryBus } from "@nestjs/cqrs"
import { GetDataBaseStatusQueryHandler } from "src/application/queries/health/get-databaseStatus.query"
import { GetLivenessQuery } from "src/application/queries/health/get-liveness.query"
import { AccessJwtGuard } from "src/presentation/guards/access.guard"
import { ResponseMessage } from "src/shared/decorator/response-matadata.decorator"

@Controller("admin")
export class AdminHealthController {
    constructor(private readonly queryBus: QueryBus){}

    @UseGuards(AccessJwtGuard)
    @ResponseMessage("Health system")
    @Get('/health-liveness') 
    async getHealthLiveness(){
        return await this.queryBus.execute(new GetLivenessQuery())
    }

    @UseGuards(AccessJwtGuard)
    @ResponseMessage("Data Base Alive")
    @Get('/dataBase-status') 
    async hetDatBaseStatus(){
        return await this.queryBus.execute(new GetDataBaseStatusQueryHandler())
    }



    

}