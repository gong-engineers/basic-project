import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderRepositoryImpl } from './order.repository';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { UserModule } from '../user/user.module';
import { PaymentModule } from '../payment/payment.module';
import { DatabaseInitService } from '../config/database-init.service';

@Module({
  imports: [TypeOrmModule.forFeature([Order]), UserModule, PaymentModule],
  controllers: [OrderController],
  providers: [OrderService, OrderRepositoryImpl, DatabaseInitService],
  exports: [OrderService, OrderRepositoryImpl],
})
export class OrderModule {}
