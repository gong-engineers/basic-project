import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentMethod } from './entities/payment.entity';
import { Repository, DeleteResult } from 'typeorm';

export interface PaymentRepository {
  create(payment: PaymentMethod): Promise<PaymentMethod>;
  save(payment: PaymentMethod): Promise<PaymentMethod>;
  findAll(memberId: number): Promise<PaymentMethod[]>;
  findById(paymentMethodId: number): Promise<PaymentMethod>;
  findByCardInfo(
    memberId: number,
    cardNumber: string,
    expiry: string,
    cvv: string,
  ): Promise<PaymentMethod>;
  delete(paymentMethodId: number): Promise<DeleteResult>;
}

@Injectable()
export class PaymentRepositoryImpl implements PaymentRepository {
  constructor(
    @InjectRepository(PaymentMethod)
    private paymentRepository: Repository<PaymentMethod>,
  ) {}

  // 결제 카드 수단 객체 작성
  async create(payment: PaymentMethod): Promise<PaymentMethod> {
    return await Promise.resolve(this.paymentRepository.create(payment));
  }

  // 결제 카드 수단 저장
  save(payment: PaymentMethod): Promise<PaymentMethod> {
    return this.paymentRepository.save(payment);
  }

  // 회원의 결제 카드 수단 리스트 호출
  async findAll(memberId: number): Promise<PaymentMethod[]> {
    return await Promise.resolve(
      this.paymentRepository.find({ where: { member: { id: memberId } } }),
    );
  }

  // 특정 결제 카드 수단 상세 호출
  async findById(paymentMethodId: number): Promise<PaymentMethod> {
    return (await Promise.resolve(
      this.paymentRepository.findOne({
        where: { paymentMethodId: paymentMethodId },
      }),
    )) as PaymentMethod;
  }

  // 기존에 등록했던 카드 결제 수단이 존재하는지 조회
  async findByCardInfo(
    memberId: number,
    cardNumber: string,
    expiry: string,
    cvv: string,
  ): Promise<PaymentMethod> {
    return (await Promise.resolve(
      this.paymentRepository.findOne({
        where: {
          member: { id: memberId },
          cardNumber: cardNumber,
          expiry: expiry,
          cvv: cvv,
        },
      }),
    )) as PaymentMethod;
  }

  // 특정 결제 카드 수단 삭제
  async delete(paymentMethodId: number): Promise<DeleteResult> {
    return await Promise.resolve(
      this.paymentRepository.delete(paymentMethodId),
    );
  }
}
