import { Injectable } from '@nestjs/common';
import {
  OrderRepository,
  OrderRepositoryImpl,
} from '../order/order.repository';
import { Order } from '../order/entities/order.entity';
import { InternalServerErrorException } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class DailyJobService {
  orderRepository: OrderRepository;

  constructor(orderRepository: OrderRepositoryImpl) {
    this.orderRepository = orderRepository;
  }

  // (Job) 스케줄링 주문 확정 작업 실행
  @Transactional()
  async run() {
    console.log('매일 자정에 스케줄링 주문 확정 작업 실행');
    // Step1 (모든 회원의 주문 이력 조회)
    const orderList = await this.loadData();
    if (orderList.length !== 0) {
      // Step2 (주문 이력 주문 확정 처리)
      await this.processData(orderList);
      // Step3
      //   await this.saveResult();
    }
  }

  // 모든 회원의 주문 이력 리스트 조회
  private async loadData(): Promise<Order[]> {
    try {
      // 아직 주문 확정 처리가 되지않은 모든 주문 이력 리스트 호출
      const orderList = await this.orderRepository.findAllUsersOrders();
      return orderList;
    } catch (error) {
      console.error('모든 회원의 주문 이력 리스트 조회 실패', error);
      throw new InternalServerErrorException(
        '모든 회원의 주문 이력 리스트 조회 실패',
      );
    }
  }

  // 모든 회원의 주문 이력 리스트 중 조건에 해당하는 이력들 확정 처리
  private async processData(orderList: Order[]) {
    // 주문 이력 리스트 중 조건에 해당하는 이력들의 주문 ID 리스트 생성
    const orderIds = orderList.map((order) => {
      return order.orderId;
    });

    try {
      const result =
        await this.orderRepository.updateAllOrdersPurchaseConfirm(orderIds);

      if (result.affected === 0) {
        throw new InternalServerErrorException(
          '모든 회원의 주문 이력 리스트 중 조건에 해당하는 이력들 확정 처리 실패',
        );
      }
    } catch (error) {
      console.error(
        '모든 회원의 주문 이력 리스트 중 조건에 해당하는 이력들 확정 처리 실패',
        error,
      );
      throw new InternalServerErrorException('주문 확정 처리 실패');
    }
  }

  private saveResult() {}
}
