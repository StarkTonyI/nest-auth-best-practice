export interface ApiResponse<T = any> {
    message: string;
    data?:T, 
    error?:errorMessage
    timestamp: Date;
    path?: string;
    method?: string
}
 interface errorMessage {
    code: string;
    details: string;
}
export class SuccessResponseDto implements ApiResponse{
    message: string;
    data?: any;
    timestamp: Date;
    path?: string | undefined;
    method?: string | undefined;
    constructor(message: string, data: any, meta?: any){
        this.message = message;
        this.data = data;
        this.timestamp = new Date()
        if(meta){
            this.path = meta.path;
            this.method = meta.method;
        }
    }
}
export class ErrorResponseDto implements ApiResponse{
    message: string;
    error: errorMessage;
    timestamp: Date;
    path?: string | undefined;
    method?: string | undefined;
    constructor(message: string, code: string, details: string, meta: any){
        this.message = message;
        this.error = {
            code, details
        }
        this.timestamp = new Date()
        if(meta){
            this.path = meta.path;
            this.method = meta.method;
        }
    }
}







