import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './presentation/modules/auth/auth.module';
import { PrismaModule } from './infrastructure/database/dataBase.module';
import { PrismaService } from './infrastructure/database/dataBase.service';
import { ApiConfigModule } from './infrastructure/services/configService/apiConfig.module';
import { ResponseModule } from './infrastructure/services/response/response.module';
import { APP_FILTER, APP_INTERCEPTOR, Reflector } from '@nestjs/core';
import { LogginInterceptor } from './presentation/interceptor/logger.interceptor';
import { ResponseInterceptor } from './presentation/interceptor/response.interceptor';
import { ApiExeptionFilter } from './presentation/filters/api-exception.filter';
import { LoggerService } from './infrastructure/logger/logger.service';
import { LoggerMiddleware } from './presentation/middleware/logger.middleware';
import { RequestIdMiddleware } from './presentation/middleware/request-id.middleware';
import { ProfileController } from './presentation/modules/profile/profile.controller';
import { DomainExceptionFilter } from './presentation/filters/domain-exeption';
import { ProfileModule } from './presentation/modules/profile/profile.module';
import { AuthController } from './presentation/modules/auth/auth.controller';
import RoleModule from './presentation/modules/role/role.module';

@Global()
@Module({
  imports: [AuthModule, PrismaModule, ApiConfigModule, ResponseModule, ProfileModule, RoleModule],
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
    },
    {
      provide: APP_FILTER,
      useClass: DomainExceptionFilter
    }
  ],
  exports: [LoggerService]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware, RequestIdMiddleware)
    .forRoutes(ProfileController, AuthController)
  }
}













