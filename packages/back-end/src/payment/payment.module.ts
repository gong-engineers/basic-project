import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentMethod } from './entities/payment.entity';
import { PaymentRepositoryImpl } from './payment.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentMethod])],
  providers: [PaymentRepositoryImpl],
  exports: [PaymentRepositoryImpl],
})
export class PaymentModule {}
