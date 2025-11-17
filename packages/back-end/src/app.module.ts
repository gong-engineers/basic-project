import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';

// Config imports
import { ConfigModule } from '@nestjs/config';
import { CartModule } from './cart/cart.module';
import configuration from './config/configuration';
import { validationSchema } from './config/validation.schema';
import { OrderModule } from './order/order.module';
import { PaymentModule } from './payment/payment.module';
import { ProductModule } from './product/product.module';
import { UserModule } from './user/user.module';
import { BatchModule } from './batch/batch.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [configuration],
      validationSchema,
    }),
    DatabaseModule,
    AuthModule,
    UserModule,
    ProductModule,
    CartModule,
    OrderModule,
    PaymentModule,
    BatchModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
