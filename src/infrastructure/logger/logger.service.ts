import { Injectable, Logger } from "@nestjs/common";
import { ApiConfigServices } from "src/infrastructure/services/configService/apiConfig.service";

export class Context {
    module!: string;
    method!: string;
}
@Injectable()
export class LoggerService extends Logger {
    constructor(private readonly config: ApiConfigServices){super()}

    logger(message: any, context?: Context){
        const standtart = {
            message,
            host: this.config.portConfig,
            type: 'INFO',
            timeStamp: new Date().toISOString()
        }
        const data = { standtart, ...context }
        return this.log(data)
    }

    err(message: any, context?: Context){
        const standtart = {
            message,
            host: this.config.portConfig,
            type: 'ERROR',
            timeStamp: new Date().toISOString()
        }
        const data = { standtart, ...context }
        return this.error(data)
}

    warning(message: unknown, context?: Context): void {
        const standtart = {
            message,
            host: this.config.portConfig,
            type: 'WARNING',
            timeStamp: new Date().toISOString()
        }
        const data = { standtart, ...context }
        return this.warn(data)
    }

}









