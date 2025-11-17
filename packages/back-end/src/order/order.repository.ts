import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository, DeleteResult, LessThan, In, UpdateResult } from 'typeorm';

export interface OrderRepository {
  create(order: Order): Promise<Order>;
  save(order: Order): Promise<Order>;
  findAll(memberId: number): Promise<Order[]>;
  findByMemberIdAndOrderId(memberId: number, orderId: number): Promise<Order>;
  updatePurchaseConfirm(order: Order): Promise<Order>;
  delete(orderId: number): Promise<DeleteResult>;
  findAllUsersOrders(): Promise<Order[]>;
  updateAllOrdersPurchaseConfirm(orderIds: number[]): Promise<UpdateResult>;
}

@Injectable()
export class OrderRepositoryImpl implements OrderRepository {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  // 결제 주문 객체 작성
  async create(order: Order): Promise<Order> {
    return await Promise.resolve(this.orderRepository.create(order));
  }

  // 결제 주문 저장
  save(order: Order): Promise<Order> {
    return this.orderRepository.save(order);
  }

  // 회원의 결제 주문 리스트 호출
  async findAll(memberId: number): Promise<Order[]> {
    return await Promise.resolve(
      this.orderRepository.find({ where: { member: { id: memberId } } }),
    );
  }

  // 특정 결제 주문 상세 호출
  async findByMemberIdAndOrderId(
    memberId: number,
    orderId: number,
  ): Promise<Order> {
    return (await Promise.resolve(
      this.orderRepository.findOne({
        where: { member: { id: memberId }, orderId: orderId },
      }),
    )) as Order;
  }

  // 결제 주문 확정 여부 수정
  async updatePurchaseConfirm(order: Order): Promise<Order> {
    return await Promise.resolve(this.orderRepository.save(order));
  }

  // 특정 결제 주문 삭제
  async delete(orderId: number): Promise<DeleteResult> {
    return await Promise.resolve(this.orderRepository.delete(orderId));
  }

  // 모든 회원의 주문 이력 리스트 조회
  async findAllUsersOrders(): Promise<Order[]> {
    return await Promise.resolve(
      this.orderRepository.find({
        where: {
          purchaseConfirm: 'N',
          createdAt: LessThan(new Date(Date.now() - 1000 * 60 * 60 * 24 * 3)),
        },
      }),
    );
  }

  // 일괄 주문 확정 처리
  async updateAllOrdersPurchaseConfirm(
    orderIds: number[],
  ): Promise<UpdateResult> {
    return await Promise.resolve(
      this.orderRepository.update(
        { orderId: In(orderIds) }, // 조건
        { purchaseConfirm: 'Y' }, // 수정할 값
      ),
    );
  }
}
