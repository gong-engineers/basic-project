import { Injectable, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class DatabaseInitService implements OnModuleInit {
  constructor(private readonly dataSource: DataSource) {}

  // 데이터 베이스 모듈 초기화 시 실행되는 메서드
  async onModuleInit() {
    // # 결제 주문 프로세스 실행 시 필요한 처음 실행 시퀀스 생성 조회 처리
    // 결제 주문 완료 후 생성하고자 하는 주문 번호 시퀀스 생성
    const createSequenceIfNotExist = `
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'order_seq') THEN
          CREATE SEQUENCE order_seq START 1;
          RAISE NOTICE 'Created order_seq sequence';
        ELSE
          RAISE NOTICE 'order_seq sequence already exists';
        END IF;
      END
      $$;
    `;
    await this.dataSource.query(createSequenceIfNotExist);
  }
}
