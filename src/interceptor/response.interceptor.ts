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
        const response = context.switchToHttp().getResponse();

        console.log(request.path)
        return next.handle()
        .pipe(map((data)=> {
            const reflector = this.reflector.get(RESPONSE_MESSAGE, context.getHandler())
            if('refresh_token' in data && (request.path.includes("login") || request.path.includes("refresh-token"))){
                console.log("Start coooking")
                console.log(data.refresh_token)
                response.cookie('refreshToken', data.refresh_token, {
                    httpOnly: true,    // Защита от XSS (JS не достанет)
                    secure: true,      // Только по HTTPS
                    sameSite: 'strict', // Защита от CSRF
                    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 дней в мс
          });
            return this.response.success(reflector, { ...data, refresh_token:"***" })
            }
            return this.response.success(reflector, data ?? null, request)
        }))
    }
}
//64d7ae5c-753a-449e-a502-28b90e071f80