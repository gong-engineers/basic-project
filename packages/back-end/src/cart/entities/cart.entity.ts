import {
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Index('idx_cart_member_id', ['member'])
@Entity('carts')
export class Cart {
  @PrimaryGeneratedColumn()
  cartId: number;

  @Column({
    type: 'bigint',
    nullable: false,
    comment: '장바구니 제품 카테고리 ID',
  })
  categoryId: number;

  @Column({
    type: 'varchar',
    length: 30,
    nullable: false,
    comment: '장바구니 제품 카테고리 명',
  })
  categoryName: string;

  @Column({
    type: 'bigint',
    nullable: false,
    comment: '장바구니 제품 ID',
  })
  productId: number;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    comment: '장바구니 제품 썸네일 이미지',
  })
  thumbImage: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    comment: '장바구니 제품 명',
  })
  productName: string;

  @Column({
    type: 'integer',
    nullable: false,
    comment: '장바구니 제품 가격',
  })
  price: number;

  @Column({
    type: 'integer',
    nullable: false,
    comment: '장바구니 제품 갯수',
    default: 1,
  })
  quantity: number;

  @Column({
    type: 'char',
    length: 1,
    nullable: false,
    comment: "장바구니 옵션 유무 (default 'N')",
    default: 'N',
  })
  optionCheck: string;

  @Column({
    type: 'integer',
    nullable: false,
    comment: '장바구니 옵션 ID (default 0)',
    default: 0,
  })
  optionId: number;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
    comment: '장바구니 옵션 명 (default null)',
    default: null,
  })
  optionName: string | null;

  @Column({
    type: 'integer',
    nullable: false,
    comment: '장바구니 옵션 가격 (default 0)',
    default: 0,
  })
  optionPrice: number;

  @Column({
    type: 'integer',
    nullable: false,
    comment:
      '장바구니 총 가격 (quantity * (price 또는 discountPrice + optionPrice))',
    default: 0,
  })
  totalPrice: number;

  @ManyToOne(() => User, (user) => user.carts, {
    onDelete: 'CASCADE',
    eager: false,
  })
  @JoinColumn({
    name: 'member_id',
    foreignKeyConstraintName: 'fk_cart_member_id',
    referencedColumnName: 'id',
  })
  member: User;

  @Column({
    type: 'timestamp',
    nullable: false,
    comment: '장바구니 제품 담기 생성 일자',
    default: () => 'CURRENT_TIMESTAMP',
  })
  @CreateDateColumn()
  createdAt: Date;

  @Column({
    type: 'timestamp',
    nullable: true,
    comment: '장바구니 제품 정보 수정 일자',
    default: null,
  })
  @UpdateDateColumn()
  updatedAt: Date | null;
}
