import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { exec } from "child_process";
import { Request, Response } from "express";
import { DomainException } from "src/core/exeption/domain-exeptions";
import { LoggerService } from "src/infrastructure/logger/logger.service";

@Catch(DomainException)
export class DomainExceptionFilter implements ExceptionFilter {
    constructor(private readonly loggerService: LoggerService){}
    catch(exception: any, host: ArgumentsHost) {
        const request = host.switchToHttp().getRequest() as Request;
        const response = host.switchToHttp().getResponse() as Response
        const path = request.path;
        const status = exception.getStatus();
       
        this.loggerService.err({
            message: exception.getResponse(), 
            path, status, 
            date:new Date(), 
            details: exception.details, 
            exceptionName: exception.name, 
            stack: exception.stack
        })

        return response.status(status).json({ 
            message: exception.getResponse(),
            path, status, 
            date:new Date() });
    }
}