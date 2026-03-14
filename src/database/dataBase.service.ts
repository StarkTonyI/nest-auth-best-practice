import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { ApiConfigServices } from 'src/configService/apiConfig.service';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor(apiconfigService: ApiConfigServices) {
    // 1. Сначала готовим ингредиенты
    const connectionString = apiconfigService.dataBaseCongif; // Без скобок, если это get

    const pool = new Pool({ connectionString });
    const adapter = new PrismaPg(pool);

    // 2. Вызываем super ТОЛЬКО ОДИН РАЗ с адаптером
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}


