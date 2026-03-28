import { Injectable } from "@nestjs/common";
import { Request } from "express";
import { ApiResponse, ErrorResponseDto, SuccessResponseDto } from "src/dto/response/auth-reponse-common.dto";
@Injectable()
export class ResponseService {
    success(message: string, data: any, meta?: any): SuccessResponseDto{
        return new SuccessResponseDto(message, data, meta)
    }
    error(message: string, code: string, details: string, meta?: any):ErrorResponseDto {
        return new ErrorResponseDto(message, code, details, meta)
    }
    withRequest(reponse:ApiResponse, req: Request){
        reponse.method = req.method;
        reponse.path = req.path;
        return reponse;
    }
}