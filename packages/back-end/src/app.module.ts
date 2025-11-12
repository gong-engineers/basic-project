import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';

// Config imports
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { validationSchema } from './config/validation.schema';
import { UserModule } from './user/user.module';
import { CartModule } from './cart/cart.module';
import { OrderModule } from './order/order.module';
import { PaymentModule } from './payment/payment.module';

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
    CartModule,
    OrderModule,
    PaymentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
