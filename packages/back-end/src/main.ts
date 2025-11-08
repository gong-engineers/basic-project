import {
  initializeTransactionalContext,
  addTransactionalDataSource,
} from 'typeorm-transactional';
import { DataSource } from 'typeorm';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  // 트랜잭션 컨텍스트 초기화
  initializeTransactionalContext();

  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      transports: [
        new winston.transports.Console({
          level: process.env.NODE_ENV === 'production' ? 'info' : 'silly',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            winston.format.prettyPrint(),
          ),
        }),
        new winston.transports.DailyRotateFile({
          level: 'info',
          dirname: 'logs',
          filename: '%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '14d',
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json(),
          ),
        }),
      ],
    }),
  });

  // Nest가 관리하는 TypeORM DataSource 인스턴스 주입
  const dataSource = app.get(DataSource);

  // 트랜잭션 관리 매니저에 등록 (데이터 작업 처리를 진행할 때 무결성과 일관성을 보장하기 위해서 Transactionl을 사용하도록 하였습니다.)
  addTransactionalDataSource(dataSource);

  // CORS 허용
  app.enableCors({
    origin: true, // 모든 도메인 허용
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS', 'PUT', 'HEAD'], // CORS 허용할 메소드 설정
  });

  // 쿠키 정보 활용을 위한 쿠키 파서 미들웨어 등록
  app.use(cookieParser()); // <- HttpOnly 쿠키에 저장될 RefreshToken을 파싱하기 위해서 사용하였습니다.

  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Basic Project API')
      .setDescription('The Basic Project API description')
      .setVersion('1.0')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
