import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from "@nestjs/common";
import { Request, Response } from "express";
import { ResponseService } from "src/infrastructure/services/response/response.service";

@Catch()
export class ApiExeptionFilter implements ExceptionFilter {
    constructor(private readonly responseService: ResponseService){}
    catch(exception: any, host: ArgumentsHost) {
        
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const request = ctx.getRequest<Request>();


    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let code = 'INTERNAL_ERROR';
    let details = null as any;

      if(exception instanceof HttpException){
            status = exception.getStatus();
            const responseExeption = exception.getResponse() as any;
            if(exception instanceof BadRequestException){
                if(Array.isArray(responseExeption.message)){
                    message = 'Validation failed',
                    code = 'VALIDATION_ERROR',
                    details = responseExeption.message
                }else if(typeof responseExeption.message === 'string'){
                    message = 'VALIDATOIN_FAILER',
                    code = 'VALIDATION_ERROR',
                    details = [responseExeption.message];
                }else{
                    message = 'Vaildation failed',
                    code = 'BAD_REQUEST'
                }
            } else {
                if(typeof responseExeption === 'string'){
                message = responseExeption
                }else if(responseExeption.message){
                    message = Array.isArray(responseExeption.message) ? responseExeption.message[0] : responseExeption.message;
                }
            }
     switch (status) {
          case HttpStatus.UNAUTHORIZED:
            code = 'AUTHENTICATION_ERROR';
            break;
          case HttpStatus.FORBIDDEN:
            code = 'AUTHORIZATION_ERROR';
            break;
          case HttpStatus.NOT_FOUND:
            code = 'NOT_FOUND';
            break;
          case HttpStatus.CONFLICT:
            code = 'CONFLICT';
            break;
          case HttpStatus.UNPROCESSABLE_ENTITY:
            code = 'VALIDATION_ERROR';
            details = responseExeption.message;
            break;
          case HttpStatus.TOO_MANY_REQUESTS:
            code = 'RATE_LIMIT_EXCEEDED';
            break;
          default:
            code = 'HTTP_ERROR';
        }
      } 

    else if (exception instanceof Error) {
      message = exception.message;
      code = 'APPLICATION_ERROR';
    }

    const errorResponse = this.responseService.error(message, code, details || '');
    const responseWithContext = this.responseService.withRequest(
      errorResponse,
      request,
    );

    response.status(status).json(responseWithContext);


    }
}


