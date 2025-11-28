import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { CartRepositoryImpl } from './cart.repository';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Cart]), UserModule],
  controllers: [CartController],
  providers: [CartService, CartRepositoryImpl],
  exports: [CartService, CartRepositoryImpl],
})
export class CartModule {}
