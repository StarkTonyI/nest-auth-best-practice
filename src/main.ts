import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser'; // Убираем * as
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser())
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Удалит из запроса все поля, которых нет в DTO (защита от лишнего мусора)
    forbidNonWhitelisted: true, // Выбросит ошибку, если прислали лишнее поле
    transform: true, // Автоматически превратит строку в число/булево, если в DTO указан тип number/boolean
  }));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
