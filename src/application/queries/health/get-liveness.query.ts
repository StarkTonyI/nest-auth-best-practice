
import { Injectable } from '@nestjs/common';
import { IQueryHandler, Query, QueryHandler } from '@nestjs/cqrs';
import { LivenessResponse } from 'src/application/dtos/health/liveness-response.dto';

export class GetLivenessQuery extends Query<LivenessResponse> {}

@Injectable()
@QueryHandler(GetLivenessQuery)
export class GetLivenessQueryHandler implements IQueryHandler<GetLivenessQuery> {
  constructor() {}

  async execute(): Promise<LivenessResponse> {
    const memUsage = process.memoryUsage();
    const totalMemory = memUsage.heapTotal + memUsage.external + memUsage.arrayBuffers;
    const usedMemory = memUsage.heapUsed + memUsage.external + memUsage.arrayBuffers;
    const memoryUsage = Math.round((usedMemory / totalMemory) * 100 * 100) / 100;

    // CPU usage calculation (simplified)
    const startUsage = process.cpuUsage();
    await new Promise((resolve) => setTimeout(resolve, 100)); // 100ms sampling
    const endUsage = process.cpuUsage(startUsage);

    // Convert microseconds to milliseconds and calculate percentage
    const totalCpuTime = (endUsage.user + endUsage.system) / 1000; // Convert to ms
    const cpuUsage = Math.min(Math.round((totalCpuTime / 100) * 100) / 100, 100); // Cap at 100%

      return {
      status: 'alive',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memoryUsage,
      cpuUsage,
    };
}
}