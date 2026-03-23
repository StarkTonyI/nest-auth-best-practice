import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const RawToken = createParamDecorator((data: unknown, execute: ExecutionContext)=>{
    const req = execute.switchToHttp().getRequest();
    console.log('raw token');
    console.log(req.rawRefresh)
    return req.rawRefresh;
})

