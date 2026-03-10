import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
@Injectable()
export class ApiConfigServices {
    constructor(private readonly config: ConfigService){}

    get(envParam: string){
        if(!envParam){
            throw new Error('Something get wrong...')
        }
        return this.config.getOrThrow(envParam)
    }

    get portConfig(){
        return this.get('PORT')
    }

    get dataBaseCongif(): string{
        return this.get('DATABASE_URL')
    }


}