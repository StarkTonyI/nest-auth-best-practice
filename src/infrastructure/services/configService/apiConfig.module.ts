import { Module } from "@nestjs/common";
import { ApiConfigServices } from "./apiConfig.service";
import { ConfigModule } from "@nestjs/config";

@Module({ // Добавь @ здесь!
    imports: [ConfigModule.forRoot()],
    providers: [ApiConfigServices],
    exports: [ApiConfigServices] // Это правильно, теперь другие модули увидят сервис
})
export class ApiConfigModule {}