import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';
import { OrderRepository } from './order.repository';
import { PaymentRepository } from '../payment/payment.repository';
import { CartRepository } from '../cart/cart.repository';
import { UserService } from '../user/user.service';
import type { AccessRequest } from '../auth/interfaces/jwt-payload.interface';
import { OrderRequestDto } from './dto/request/order-request.dto';
import { PurchaseConfirmRequestDto } from './dto/response/purchase-confirm-request.dto';
import { OrderInfoResponseDto } from './dto/response/order-info-response.dto';
import {
  InternalServerErrorException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { OrderRepositoryImpl } from './order.repository';
import { PaymentRepositoryImpl } from '../payment/payment.repository';
import { Order } from './entities/order.entity';
import { PaymentMethod } from '../payment/entities/payment.entity';
import * as bcrypt from 'bcrypt';
import { ulid } from 'ulid';
import { DataSource } from 'typeorm';
import { ResponseDto } from '../common/response.dto';
import { CartRepositoryImpl } from '../cart/cart.repository';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class OrderService {
  // 로깅을 위한 Logger 객체
  private readonly logger = new Logger(OrderService.name);
  orderRepository: OrderRepository;
  userService: UserService;
  paymentRepository: PaymentRepository;
  cartRepository: CartRepository;

  constructor(
    private readonly dataSource: DataSource,
    orderRepository: OrderRepositoryImpl,
    userService: UserService,
    paymentRepository: PaymentRepositoryImpl,
    cartRepository: CartRepositoryImpl,
  ) {
    this.dataSource = dataSource;
    this.orderRepository = orderRepository;
    this.userService = userService;
    this.paymentRepository = paymentRepository;
    this.cartRepository = cartRepository;
  }

  // 주문 진행 service
  @Transactional()
  async orderProgress(
    request: AccessRequest,
    orderRequestDto: OrderRequestDto,
  ) {
    this.logger.log(`[OrderService] 주문 진행`);
    console.log('결제 진행 service 진입');

    try {
      // 로그인한 유저의 JWT 토큰에서 추출한 사용자
      const user = await this.userService.findOne(request.user.id);

      // 로그인한 유저가 없으면 권한 거절
      if (!user) {
        this.logger.warn(`Invalid user with ID: ${request.user.id}`);
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
        console.log('이전에 존재한 결제 카드가 있습니다. 결제 진행합니다.');

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
            phone: orderRequestDto.phone,
            recipientName: orderRequestDto.recipientName,
            deliveryType: orderRequestDto.deliveryType,
            deliveryAddress: eachOrder.deliveryAddress,
            deliveryFee: eachOrder.deliveryFee,
            paymentMethodId: existingPayment.paymentMethodId,
            purchaseConfirm: 'N',
            createdAt: new Date(), // 주문 생성 일자
            updatedAt: new Date(),
            member: user,
          } as Order);

          await this.orderRepository.save(order);

          await this.cartRepository.delete(eachOrder.cartId!); // 장바구니 제품 결제 완료 후 장바구니에서 제거
          console.log('주문 이력 데이터 생성 완료 : ', order);
        }
      } else {
        console.log('이전에 존재한 결제 카드가 없습니다. 새롭게 등록합니다.');

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
            phone: orderRequestDto.phone,
            recipientName: orderRequestDto.recipientName,
            deliveryType: orderRequestDto.deliveryType,
            deliveryAddress: eachOrder.deliveryAddress,
            deliveryFee: eachOrder.deliveryFee,
            paymentMethodId: newPaymentMethod.paymentMethodId,
            purchaseConfirm: 'N',
            createdAt: new Date(),
            updatedAt: new Date(),
            member: user,
          } as Order);

          await this.orderRepository.save(order);
          await this.cartRepository.delete(eachOrder.cartId!); // 장바구니 제품 결제 완료 후 장바구니에서 제거

          console.log('주문 이력 데이터 생성 완료 : ', order);
        }
      }
      console.log('최종 결제 진행 완료');

      return ResponseDto.success('주문 진행 성공', null);
    } catch (error) {
      this.logger.error(`Error order progress: ${error}`);
      throw new InternalServerErrorException('장바구니 담기 실패');
    }
  }

  // 결제 주문 이력 리스트 조회 service
  async orderInfoList(request: AccessRequest) {
    this.logger.log(`[OrderService] 결제 주문 이력 리스트 조회`);
    console.log('결제 주문 이력 리스트 조회 service 진입');

    try {
      // 로그인한 유저의 JWT 토큰에서 추출한 사용자
      const user = await this.userService.findOne(request.user.id);

      // 로그인한 유저가 없으면 권한 거절
      if (!user) {
        this.logger.warn(`Invalid user with ID: ${request.user.id}`);
        throw new UnauthorizedException('Access denied');
      }

      // 회원이 가지고 있는 주문 이력 리스트 호출 (index로 빠르게 조회)
      const orderInfoList = await this.orderRepository.findAll(user.id);

      // 호출한 주문 이력 리스트를 반환 리스트 객체로 매핑
      const convertedOrderInfoList = orderInfoList.map((order) => {
        return {
          orderId: order.orderId,
          orderNumber: order.orderNumber,
          productId: order.productId,
          productName: order.productName,
          price: order.price,
          quantity: order.quantity,
          optionCheck: order.optionCheck,
          optionId: order.optionId,
          optionName: order.optionName,
          optionPrice: order.optionPrice,
          totalPrice: order.totalPrice,
          phone: order.phone,
          recipientName: order.recipientName,
          deliveryType: order.deliveryType,
          deliveryAddress: order.deliveryAddress,
          deliveryFee: order.deliveryFee,
          purchaseConfirm: order.purchaseConfirm,
          createdAt: order.createdAt,
        };
      }) as OrderInfoResponseDto[];

      return ResponseDto.success(
        '결제 주문 이력 리스트 조회 성공',
        convertedOrderInfoList,
      );
    } catch (error) {
      this.logger.error(`Error order info list: ${error}`);
      throw new InternalServerErrorException('결제 주문 이력 리스트 조회 실패');
    }
  }

  // 결제 주문 확정 처리 service
  @Transactional()
  async purchaseConfirm(
    request: AccessRequest,
    purchaseConfirmRequestDto: PurchaseConfirmRequestDto,
  ) {
    this.logger.log(`[OrderService] 결제 주문 확정 처리`);
    console.log('결제 주문 확정 처리 service 진입');

    try {
      // 로그인한 유저의 JWT 토큰에서 추출한 사용자
      const user = await this.userService.findOne(request.user.id);

      // 로그인한 유저가 없으면 권한 거절
      if (!user) {
        this.logger.warn(`Invalid user with ID: ${request.user.id}`);
        throw new UnauthorizedException('Access denied');
      }

      // 결제 주문 확정 이전의 특정 주문 호출
      const orderBeforeConfirm =
        await this.orderRepository.findByMemberIdAndOrderId(
          user.id,
          purchaseConfirmRequestDto.orderId,
        );

      // 주문이 존재하지 않을 경우 예외 처리
      if (!orderBeforeConfirm) {
        this.logger.warn(
          `Order not found for user ID: ${user.id}, order ID: ${purchaseConfirmRequestDto.orderId}`,
        );
        throw new NotFoundException('주문을 찾을 수 없습니다');
      }

      // 결제 주문 확정 이전의 특정 주문 확정 여부 수정
      orderBeforeConfirm.purchaseConfirm =
        purchaseConfirmRequestDto.purchaseConfirm;
      await this.orderRepository.updatePurchaseConfirm(orderBeforeConfirm);

      return ResponseDto.success('결제 주문 확정 처리 성공', null);
    } catch (error) {
      this.logger.error(`Error purchase confirm: ${error}`);
      throw new InternalServerErrorException('결제 주문 확정 처리 실패');
    }
  }
}
