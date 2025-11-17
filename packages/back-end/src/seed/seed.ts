import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { SeedService } from './seed.service';

async function bootstrap() {
  const logger = new Logger('Seed');

  try {
    const app = await NestFactory.createApplicationContext(AppModule);
    const seedService = app.get(SeedService);
    await seedService.seed();
    await app.close();
    logger.log('Seeding completed successfully.');
    process.exit(0);
  } catch (error) {
    logger.error('Seeding failed:', error);
    process.exit(1);
  }
}

bootstrap();
