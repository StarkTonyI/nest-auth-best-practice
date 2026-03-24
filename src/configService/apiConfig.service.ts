import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class ApiConfigServices {
    constructor(private readonly config: ConfigService){}

    get(envParam: string){
        if(!envParam){
            throw new Error('Something get wrong...')
        }
        return this.config.getOrThrow(envParam)
    }
    private getDuration(key: string): number {
    const value = this.get(key); // Сначала достаем значение, например "10d"
    
    if (!isNaN(Number(value))) {
        return Number(value);
    }

    let number = parseInt(value);
    // Берем только буквы (убираем цифры)
    const letter = value.replace(number.toString(), "").trim();

    switch (letter) {
        case 'm': return number * 60;
        case 'h': return number * 60 * 60;
        case 'd': return number * 24 * 60 * 60;
        default: 
            throw new Error(`Бля, ${key} имеет странный формат: ${value}. Юзай m, h или d!`);
    }

}

    get portConfig(){
        return this.get('PORT')
    }

    get dataBaseCongif(): string{
        return this.get('DATABASE_URL')
    }
    get authConfig() {
    return {
        jwtSecret: this.get('JWT_SECRET'),
        jwtExpirationTime: this.getDuration('JWT_EXPIRATION_TIME'), 
    };

}
    get authConfigRefresh() {
    return {
        jwtSecret: this.get('JWT_REFRESH_SECRET'),
        jwtExpirationTime: this.getDuration('JWT_EXPIRATION_TIME_REFRESH'), 
    };
}
    get NodeENV(){
        return this.get("NODE_ENV") ?? "development"
        
    }

}