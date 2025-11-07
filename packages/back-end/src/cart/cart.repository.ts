import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Cart } from './entities/cart.entity';
import { DeleteResult, Repository } from 'typeorm';

// Cart Repository Interface
export interface CartRepository {
  create(cart: Cart): Promise<Cart>;
  save(cart: Cart): Promise<Cart>;
  findAll(memberId: number): Promise<Cart[]>;
  findById(cartId: number): Promise<Cart>;
  update(cart: Cart): Promise<Cart>;
  delete(cartId: number): Promise<DeleteResult>;
}

// 실구현 Cart Repository
@Injectable()
export class CartRepositoryImpl implements CartRepository {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
  ) {}

  // 장바구니 생성
  async create(cart: Cart): Promise<Cart> {
    return await Promise.resolve(this.cartRepository.create(cart));
  }

  // 장바구니 담기
  save(cart: Cart): Promise<Cart> {
    return this.cartRepository.save(cart);
  }

  // 장바구니 리스트 조회
  async findAll(memberId: number): Promise<Cart[]> {
    return await Promise.resolve(
      this.cartRepository.find({
        where: { member: { id: memberId } },
      }),
    );
  }

  // 특정 장바구니 상세 조회
  async findById(cartId: number): Promise<Cart> {
    return (await Promise.resolve(
      this.cartRepository.findOne({
        where: { cartId: cartId },
        relations: ['member'],
      }),
    )) as Cart;
  }

  // 장바구니 수정
  async update(cart: Cart): Promise<Cart> {
    return await Promise.resolve(this.cartRepository.save(cart));
  }

  // 장바구니 삭제
  async delete(cartId: number): Promise<DeleteResult> {
    return await Promise.resolve(this.cartRepository.delete(cartId));
  }
}
