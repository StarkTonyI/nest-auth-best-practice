import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ref } from "process";
import { map, Observable } from "rxjs";
import { RESPONSE_MESSAGE } from "src/decorator/response-matadata.dto";
import { ResponseService } from "src/service/response/response.service";
@Injectable()
export class ResponseInterceptor implements NestInterceptor {
    constructor(private readonly response: ResponseService, private readonly reflector: Reflector){}
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();

        return next.handle()
        .pipe(map((data)=> {
            const reflector = this.reflector.get(RESPONSE_MESSAGE, context.getHandler())
            if(typeof data === 'string'){
                return this.response.success(reflector, data, request)
            }

            if('refresh_token' in data && (request.path.includes("login") || request.path.includes("refresh-token"))){
                response.cookie('refreshToken', data.refresh_token, {
                    httpOnly: true,    // Защита от XSS (JS не достанет)
                    secure: true,      // Только по HTTPS
                    sameSite: 'strict', // Защита от CSRF
                    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 дней в мс
                });

                return this.response.success(reflector, { ...data, refresh_token:"***" }, request)
            }
            return this.response.success(reflector, data ?? null, request)
        }))
    }
}


