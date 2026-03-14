import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './database/dataBase.module';
import { PrismaService } from './database/dataBase.service';
import { ApiConfigModule } from './configService/apiConfig.module';

@Module({
  imports: [AuthModule, PrismaModule, ApiConfigModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
