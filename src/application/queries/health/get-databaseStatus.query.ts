
import { Injectable } from '@nestjs/common';
import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { DataBaseStatus } from 'src/application/dtos/health/liveness-response.dto';
import { HealthService } from 'src/infrastructure/services/healthService/health.service';

export class GetDataBaseStatusQueryHandler extends Query<DataBaseStatus> {}

@Injectable()
@QueryHandler(GetDataBaseStatusQueryHandler)
export class GetLivenessQueryHandler implements IQueryHandler<GetDataBaseStatusQueryHandler> {
  constructor(private readonly healthService: HealthService) {}

  async execute(): Promise<DataBaseStatus> {
    const start = Date.now();
    await this.healthService.checkDataBase()
    const end = Date.now() - start;

    return {
      message: 'alive',
      timestamp: new Date().toISOString(),
      status:"DataBase work successfull",
      speed: end
    }

  }}