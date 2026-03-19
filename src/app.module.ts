import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './database/dataBase.module';
import { PrismaService } from './database/dataBase.service';
import { ApiConfigModule } from './configService/apiConfig.module';
import { ResponseModule } from './service/response/response.module';
import { APP_FILTER, APP_INTERCEPTOR, Reflector } from '@nestjs/core';
import { LogginInterceptor } from './interceptor/logger.interceptor';
import { ResponseInterceptor } from './interceptor/response.interceptor';
import { ApiExeptionFilter } from './filters/api-exception.filter';
import { ProfileModule } from './profile/profile.module';
import { LoggerService } from './auth/services/logger.service';

@Global()
@Module({
  imports: [AuthModule, PrismaModule, ApiConfigModule, ResponseModule, ProfileModule],
  controllers: [AppController],
  providers: [AppService, PrismaService, Reflector, LoggerService, 
    {
      provide: APP_INTERCEPTOR,
      useClass: LogginInterceptor, // Nest сам найдет зависимости для него
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor, // И для этого тоже (ResponseService и Reflector)
    },
    {
      provide: APP_FILTER,
      useClass: ApiExeptionFilter
    }
  ],
  exports: [LoggerService]
})
export class AppModule {}
