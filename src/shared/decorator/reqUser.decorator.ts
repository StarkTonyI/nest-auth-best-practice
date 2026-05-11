import { createParamDecorator, ExecutionContext, UseGuards } from "@nestjs/common";

interface ReqDecorator {
    id: string;
    email: string;
}

export const ReqUser = createParamDecorator((reqData: keyof ReqDecorator  | null, ctx: ExecutionContext)=>{
    const req = ctx.switchToHttp().getRequest();
    const { user } = req;
    return reqData ? user[reqData] : user;
})
