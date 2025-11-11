import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { OrderRepository } from './order.repository';
import { PaymentRepository } from '../payment/payment.repository';
import { UserService } from '../user/user.service';
import { AccessRequest } from 'src/auth/interfaces/jwt-payload.interface';
import { OrderRequestDto } from './dto/request/order-request.dto';
import {
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { OrderRepositoryImpl } from './order.repository';
import { PaymentRepositoryImpl } from '../payment/payment.repository';
import { Order } from './entities/order.entity';
import { PaymentMethod } from '../payment/entities/payment.entity';
import * as bcrypt from 'bcrypt';
import { ulid } from 'ulid';
import { DataSource } from 'typeorm';
import { ResponseDto } from '../common/response.dto';

@Injectable()
export class OrderService {
  // 로깅을 위한 Logger 객체
  private readonly logger = new Logger(OrderService.name);
  // Cart Repository 인터페이스 객체 필드
  orderRepository: OrderRepository;
  userService: UserService;
  paymentRepository: PaymentRepository;

  constructor(
    private readonly dataSource: DataSource,
    orderRepository: OrderRepositoryImpl,
    userService: UserService,
    paymentRepository: PaymentRepositoryImpl,
  ) {
    this.dataSource = dataSource;
    this.orderRepository = orderRepository;
    this.userService = userService;
    this.paymentRepository = paymentRepository;
  }

  // 주문 진행 service
  async orderProgress(
    request: AccessRequest,
    orderRequestDto: OrderRequestDto,
  ) {
    this.logger.log(`[OrderService] 주문 진행`);

    try {
      // 로그인한 유저의 JWT 토큰에서 추출한 사용자
      const user = await this.userService.findOne(request.user.id);

      // 로그인한 유저가 없거나 리프레시 토큰이 없으면 권한 거절
      if (!user || !user.hashRefreshToken) {
        this.logger.warn(
          `Invalid refresh token for user with ID: ${request.user.id}`,
        );
        throw new UnauthorizedException('Access denied');
      }

      // 이전에 등록한 결제 카드 수단이었는지 확인하기 위해 해당 카드 정보 조회
      const existingPayment = await this.paymentRepository.findByCardInfo(
        user.id,
        orderRequestDto.cardNumber,
        orderRequestDto.expiry,
        orderRequestDto.cvv,
      );

      // 시퀀스에서 다음 번호 가져오기
      const result = await this.dataSource.query<Array<{ seq: number }>>(
        "SELECT nextval('order_seq') AS seq",
      );
      const padded = String(result[0].seq).padStart(6, '0');
      const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD

      // 주문 번호 생성
      const orderNumber = 'ORD-' + datePart + '-' + padded;

      // 거래 고유 ID(Transaction ID) 생성
      const transactionId = 'TX-' + ulid();

      // 이전 결제 카드 수단이 존재할 경우 진입
      if (existingPayment) {
        // 이전 등록한 결제 카드의 비밀번호와 현재 결제 진행하고자 입력한 비밀번호가 일치하는지 확인
        const match = await bcrypt.compare(
          orderRequestDto.password,
          existingPayment.password,
        );

        // 비밀번호가 일치하지 않을 경우 예외 처리 진행
        if (!match) {
          this.logger.warn(
            `Invalid card password for user with ID: ${user.id}`,
          );
          throw new UnauthorizedException('Access denied');
        }

        // 주문 리스트를 돌리면 하나씩 주문이력 데이터 생성
        for (const eachOrder of orderRequestDto.orders) {
          const order = await this.orderRepository.create({
            transactionId: transactionId,
            orderNumber: orderNumber,
            cartOrderCheck: eachOrder.cartOrderCheck,
            cartId: eachOrder.cartId,
            categoryId: eachOrder.categoryId,
            productId: eachOrder.productId,
            productName: eachOrder.productName,
            price: eachOrder.price,
            quantity: eachOrder.quantity,
            optionCheck: eachOrder.optionCheck,
            optionId: eachOrder.optionId,
            optionName: eachOrder.optionName,
            optionPrice: eachOrder.optionPrice,
            totalPrice: eachOrder.totalPrice,
            deliveryAddress: eachOrder.deliveryAddress,
            deliveryFee: eachOrder.deliveryFee,
            paymentMethodId: existingPayment.paymentMethodId,
            createdAt: new Date(), // 주문 생성 일자
            updatedAt: new Date(),
            member: user,
          } as Order);

          await this.orderRepository.save(order);
        }
      } else {
        // 새롭게 등록할 결제 카드의 비밀번호 단방향 해싱 처리
        const hashedCardPassword = await bcrypt.hash(
          orderRequestDto.password,
          11,
        );

        // 새롭게 등록할 결제 카드 수단 정보 작성
        const payment = await this.paymentRepository.create({
          cardHolderName: orderRequestDto.cardHolderName,
          cardNumber: orderRequestDto.cardNumber,
          expiry: orderRequestDto.expiry,
          cvv: orderRequestDto.cvv,
          password: hashedCardPassword,
          member: user,
        } as PaymentMethod);

        // 결제 카드 수당 등록
        const newPaymentMethod = await this.paymentRepository.save(payment);

        // 주문 리스트를 돌리면 하나씩 주문이력 데이터 생성
        for (const eachOrder of orderRequestDto.orders) {
          const order = await this.orderRepository.create({
            transactionId: transactionId,
            orderNumber: orderNumber,
            cartOrderCheck: eachOrder.cartOrderCheck,
            cartId: eachOrder.cartId,
            categoryId: eachOrder.categoryId,
            productId: eachOrder.productId,
            productName: eachOrder.productName,
            price: eachOrder.price,
            quantity: eachOrder.quantity,
            optionCheck: eachOrder.optionCheck,
            optionId: eachOrder.optionId,
            optionName: eachOrder.optionName,
            optionPrice: eachOrder.optionPrice,
            totalPrice: eachOrder.totalPrice,
            deliveryAddress: eachOrder.deliveryAddress,
            deliveryFee: eachOrder.deliveryFee,
            paymentMethodId: newPaymentMethod.paymentMethodId,
            createdAt: new Date(),
            updatedAt: new Date(),
            member: user,
          } as Order);

          await this.orderRepository.save(order);
        }
      }

      return ResponseDto.success('주문 진행 성공', null);
    } catch (error) {
      this.logger.error(`Error order progress: ${error}`);
      throw new InternalServerErrorException('장바구니 담기 실패');
    }
  }
}
