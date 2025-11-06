import { Injectable, InternalServerErrorException } from '@nestjs/common'; // Injectable 의존성 주입 데코레이터
import { CartInDto } from './dto/request/cart-in.dto'; // 장바구니 담기 Dto 객체
import { Logger } from '@nestjs/common';
import { Cart } from './entities/cart.entity'; // Cart Entity
import { Transactional } from 'typeorm-transactional';
import { CartRepository, CartRepositoryImpl } from './cart.repository';
import type { AccessRequest } from '../auth/interfaces/jwt-payload.interface';
import { UserService } from '../user/user.service';
import { UnauthorizedException, NotFoundException } from '@nestjs/common';
import { common } from '@basic-project/shared-types';
import { CartUpdateDto } from './dto/request/cart-update.dto';

@Injectable()
export class CartService {
  // 로깅을 위한 Logger 객체
  private readonly logger = new Logger(CartService.name);
  // Cart Repository 인터페이스 객체 필드
  cartRepository: CartRepository;
  userService: UserService;

  // Cart Repository 생성자 주입
  constructor(cartRepository: CartRepositoryImpl, userService: UserService) {
    this.cartRepository = cartRepository;
    this.userService = userService;
  }

  // 장바구니 담기 service
  async cartIn(request: AccessRequest, cartInDto: CartInDto) {
    this.logger.log(`[CartService] 장바구니 담기`);

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

      // 로그인 유저 정보와 장바구니 담기 정보를 바탕으로 장바구니 데이터 생성
      const cart = await this.cartRepository.create({
        categoryId: cartInDto.categoryId,
        categoryName: cartInDto.categoryName,
        productId: cartInDto.productId,
        productName: cartInDto.productName,
        price: cartInDto.price,
        quantity: cartInDto.quantity,
        optionCheck: cartInDto.optionCheck,
        optionId: cartInDto.optionId,
        optionName: cartInDto.optionName,
        optionPrice: cartInDto.optionPrice,
        totalPrice: cartInDto.totalPrice,
        memberId: user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Cart);

      // 장바구니 데이터 저장
      this.cartRepository.save(cart);

      // 장바구니 데이터 저장
      return common.ResponseDto.success('장바구니 담기 성공', null);
    } catch (error) {
      this.logger.error(`Error cartIn: ${error}`);
      throw new InternalServerErrorException('장바구니 담기 실패');
    }
  }

  // 장바구니 리스트 조회 service
  async cartList(request: AccessRequest) {
    this.logger.log(`[CartService] 장바구니 리스트 조회`);

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

      // 로그인한 유저의 장바구니 리스트 조회
      const cartList = await this.cartRepository.findAll(user.id);

      return common.ResponseDto.success('장바구니 리스트 조회 성공', cartList);
    } catch (error) {
      this.logger.error(`Error cartList: ${error}`);
      throw new InternalServerErrorException('장바구니 리스트 조회 실패');
    }
  }

  // 장바구니 수정 service
  @Transactional()
  async cartUpdate(request: AccessRequest, cartUpdateDto: CartUpdateDto) {
    this.logger.log(`[CartService] 장바구니 수정`);

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

      // 수정하고자 하는 장바구니 조회
      const cart = await this.cartRepository.findById(cartUpdateDto.cartId);

      // 수정하고자 하는 장바구니가 없거나 로그인한 유저가 가진 장바구니가 아니면 권한 거절
      if (!cart || cart.memberId != user.id) {
        this.logger.warn(
          `Cart not found with ID: ${cartUpdateDto.cartId} or not user's cart`,
        );
        throw new NotFoundException('Cart not found');
      }

      // 수정할 장바구니 내용 삽입
      cart.price = cartUpdateDto.price;
      cart.quantity = cartUpdateDto.quantity;
      cart.optionCheck = cartUpdateDto.optionCheck;
      cart.optionId = cartUpdateDto.optionId;
      cart.optionName = cartUpdateDto.optionName;
      cart.optionPrice = cartUpdateDto.optionPrice;
      cart.totalPrice = cartUpdateDto.totalPrice;
      cart.updatedAt = new Date();

      // 수정한 장바구니 내용 저장
      await this.cartRepository.update(cart);

      return common.ResponseDto.success('장바구니 수정 성공', null);
    } catch (error) {
      this.logger.error(`Error CartUpdate: ${error}`);
      throw new InternalServerErrorException('장바구니 수정 실패');
    }
  }

  // 장바구니 삭제 service
  @Transactional()
  async cartDelete(request: AccessRequest, cartId: number) {
    this.logger.log(`[CartService] 장바구니 삭제`);

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

      // 삭제하고자 하는 장바구니 조회
      const cart = await this.cartRepository.findById(cartId);

      // 삭제하고자 하는 장바구니가 없거나 로그인한 유저가 가진 장바구니가 아니면 권한 거절
      if (!cart || cart.memberId != user.id) {
        this.logger.warn(
          `Cart not found with ID: ${cartId} or not user's cart`,
        );
        throw new NotFoundException('Cart not found');
      }

      // 삭제하고자 하는 장바구니 삭제
      const result = await this.cartRepository.delete(cartId);

      if (result.affected == 0) {
        this.logger.warn(
          `Cart not found with ID: ${cartId} or not user's cart`,
        );
        throw new NotFoundException('Cart not found');
      }

      return common.ResponseDto.success('장바구니 삭제 성공', null);
    } catch (error) {
      this.logger.error(`Error CartDelete: ${error}`);
      throw new InternalServerErrorException('장바구니 삭제 실패');
    }
  }
}
