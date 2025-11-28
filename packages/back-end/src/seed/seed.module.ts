import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from 'src/product/entities/product.entity';
import { User } from 'src/user/entities/user.entity';
import { SeedService } from './seed.service';
import { Cart } from 'src/cart/entities/cart.entity';
import { Order } from 'src/order/entities/order.entity';
import { PaymentMethod } from 'src/payment/entities/payment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity, User, Cart, Order, PaymentMethod]),
  ],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
