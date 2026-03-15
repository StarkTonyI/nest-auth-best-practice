import { createParamDecorator, ExecutionContext, UseGuards } from "@nestjs/common";

interface ReqDecorator {
    id: string;
    email: string;
}


export const ReqUser = createParamDecorator((reqData: ReqDecorator, ctx: ExecutionContext)=>{
    if(!reqData) throw new Error('Something get wrong');
    const req = ctx.switchToHttp().getRequest();
    const { user } = req;
    return user;
})
