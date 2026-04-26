import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response } from 'express';
import { LoggerService } from 'src/services/logger.service';

const REDACT_KEYS = [/pass/i, /token/i, /auth/i, /secret/i, /^email$/i, /code/i];
const SKIP_PATHS = new Set<string>(['/', '/health', '/metrics', '/favicon.ico']);
const SKIP_METHODS = new Set<string>(['OPTIONS', 'HEAD']);
const LOGGER_METHODS = ['PUT','POST',  'PATCH', 'GET'];
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly loggerService: LoggerService) { }

  use(req: any, res: Response, next: (error?: any) => void) {
    const method:string = req.method;
    const rawUrl: string = req.url || '';
    const pathUrl: string = rawUrl.split('?')?.[0];

    if(SKIP_PATHS.has(pathUrl) || SKIP_METHODS.has(method)){
      next()
    }

    const now = Date.now();

    res.on('finish', ()=>{
      const time = Date.now() - now;
    
      const reqIp = (req.headers?.["x-forwarded-for"] as string) || '';
      const clientIp = reqIp.split(',')?.[0].trim() || req.ip || req.socket?.remoteAddress;
      const userAgent = req.headers?.['user-agent'];

      const { statusCode } = res;

      const baseLog = {
        method, 
        pathUrl, 
        statusCode,
        time,
        clientIp,
        userAgent
      } as const;

      const isServerError = statusCode >= 500;
      const isClientError = statusCode >= 400 && statusCode < 500;
      const isSlow = time > 1000; // 1s threshold

    if(LOGGER_METHODS.includes(method) && req.body){
      const redactObject = {}
      for(const [key, value] of Object.entries(req.body)){
        if(REDACT_KEYS.some(i => i.test(key))){
    
            redactObject[key] = "***"
        }
        else if(typeof value === 'string' && value.length > 256) {
          redactObject[key] = value.slice(0, 256) + "..."
        }else {
          redactObject[key] = value;
        }
      }
      const payload = { baseLog, body:  redactObject }
    /*
      if (isServerError) {
          this.loggerService.err(payload, { module: 'HTTP', method });
        } else if (isClientError || isSlow) {
          this.loggerService.warning(payload, { module: 'HTTP', method });
        } else {
          this.loggerService.logger(payload, { module: 'HTTP', method });
        }
*/
    }
    else {
       if(isServerError){  
          //this.loggerService.err(baseLog, { module: 'HTTP', method });
        } else if (isClientError || isSlow) {
          //this.loggerService.warning(baseLog, { module: 'HTTP', method });
        } else {
          //this.loggerService.logger(baseLog, { module: 'HTTP', method });
        }
      }
  });
    next()
}}



