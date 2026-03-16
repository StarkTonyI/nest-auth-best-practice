import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { map, Observable } from "rxjs";
import { RESPONSE_MESSAGE } from "src/decorator/response-matadata.dto";
import { ResponseService } from "src/service/response/response.service";
@Injectable()
export class ResponseInterceptor implements NestInterceptor {
    constructor(private readonly response: ResponseService, private readonly reflector: Reflector){}
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        const request = context.switchToHttp().getRequest();
    
        return next.handle()
        .pipe(map((data)=> {
            console.log('This check:', this);
             const reflector = this.reflector.get(RESPONSE_MESSAGE, context.getHandler())
            return this.response.success(reflector, data ?? null, request)
        }))
    }
}