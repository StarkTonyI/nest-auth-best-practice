import { DatabaseConnectionException } from "src/core/exeption/domain-exeptions";
import { PrismaService } from "src/infrastructure/database/dataBase.service";

export class HealthService {
    constructor(private readonly prismaService: PrismaService){}

    async checkDataBase(){
        try{
            await this.prismaService.$queryRaw`SELECT 1`
        }catch(err){
            if(!(err instanceof Error)) throw new Error("Base failed.")
            throw new DatabaseConnectionException(err.message)
        }
    }
}