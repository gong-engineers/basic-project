import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

// ENTITY IMPORTS
import { User } from 'src/user/entities/user.entity';
import { ProductEntity } from 'src/product/entities/product.entity';
import { Cart } from 'src/cart/entities/cart.entity';
import { Order } from 'src/order/entities/order.entity';
import { PaymentMethod } from 'src/payment/entities/payment.entity';

// DATA IMPORTS
import { USERS_DATA } from './data/users.data';
import { PRODUCTS_DATA } from './data/products.data';
import { CARTS_DATA } from './data/carts.data';
import { ORDERS_DATA } from './data/orders.data';
import { PAYMENT_METHODS_DATA } from './data/payment-methods.data';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(PaymentMethod)
    private readonly paymentMethodRepository: Repository<PaymentMethod>,
  ) {}

  async seed() {
    this.logger.log('Staring database seeding...');
    await this.clearDatabase();
    await this.seedUsers();
    await this.seedProducts();
    await this.seedPaymentMethods();
    await this.seedCarts();
    await this.seedOrders();
    this.logger.log('Database seeding completed.');
  }

  private async clearDatabase() {
    this.logger.log('Clearing database...');

    try {
      await this.userRepository.query(
        'TRUNCATE TABLE "users", "products", "carts", "orders", "payment_methods" RESTART IDENTITY CASCADE;',
      );
      this.logger.log('Database cleared successfully.');
    } catch (error) {
      this.logger.error('Error clearing database:', error);
      throw error;
    }
  }

  private async seedUsers() {
    this.logger.log('Seeding users...');
    const usersToSave = await Promise.all(
      USERS_DATA.map(async (user) => {
        if (!user.password) return user;
        const hashedPassword = await bcrypt.hash(user.password, 10);
        return { ...user, password: hashedPassword };
      }),
    );

    await this.userRepository.save(usersToSave);
    this.logger.log(`Seeded ${usersToSave.length} users.`);
  }

  private async seedProducts() {
    this.logger.log('Seeding products...');
    await this.productRepository.save(PRODUCTS_DATA);
    this.logger.log(`Seeded ${PRODUCTS_DATA.length} products.`);
  }

  private async seedCarts() {
    this.logger.log('Seeding carts...');
    await this.cartRepository.save(CARTS_DATA);
    this.logger.log(`Seeded ${CARTS_DATA.length} cart items.`);
  }

  private async seedOrders() {
    this.logger.log('Seeding orders...');
    await this.orderRepository.save(ORDERS_DATA);
    this.logger.log(`Seeded ${ORDERS_DATA.length} orders.`);
  }

  private async seedPaymentMethods() {
    this.logger.log('Seeding payment methods...');
    await this.paymentMethodRepository.save(PAYMENT_METHODS_DATA);
    this.logger.log(`Seeded ${PAYMENT_METHODS_DATA.length} payment methods.`);
  }
}
