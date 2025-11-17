import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { DailyJobService } from './daily-job.service';
import { BatchService } from './batch.service';
import { OrderModule } from '../order/order.module';

@Module({
  imports: [ScheduleModule.forRoot(), OrderModule],
  providers: [BatchService, DailyJobService],
})
export class BatchModule {}
