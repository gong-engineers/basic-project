import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { DailyJobService } from './daily-job.service';

@Injectable()
export class BatchService {
  constructor(private dailyJob: DailyJobService) {}

  // 매일 자정에 스케줄링 작업 실행
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async runDailyJob() {
    await this.dailyJob.run();
  }
}
