import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository, DeleteResult } from 'typeorm';

export interface OrderRepository {
  create(order: Order): Promise<Order>;
  save(order: Order): Promise<Order>;
  findAll(memberId: number): Promise<Order[]>;
  findById(orderId: number): Promise<Order>;
  delete(orderId: number): Promise<DeleteResult>;
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
  async findById(orderId: number): Promise<Order> {
    return (await Promise.resolve(
      this.orderRepository.findOne({ where: { orderId: orderId } }),
    )) as Order;
  }

  // 특정 결제 주문 삭제
  async delete(orderId: number): Promise<DeleteResult> {
    return await Promise.resolve(this.orderRepository.delete(orderId));
  }
}
