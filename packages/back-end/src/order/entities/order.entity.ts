import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Index('idx_order_member_id', ['member'])
@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  orderId: number;

  @Column({
    type: 'varchar',
    nullable: false,
    length: 50,
    comment: '결제 거래 고유 ID',
  })
  transactionId: string;

  @Column({
    type: 'varchar',
    nullable: false,
    length: 30,
    comment: '주문 번호',
  })
  orderNumber: string;

  @Column({
    type: 'char',
    nullable: true,
    length: 1,
    comment: '장바구니 제품 체크 (default "N")',
    default: 'N',
  })
  cartOrderCheck: string;

  @Column({
    type: 'bigint',
    nullable: true,
    comment: '장바구니 제품이면 존재하는 해당 장바구니 ID',
    default: 0,
  })
  cartId: number;

  @Column({
    type: 'bigint',
    nullable: true,
    comment: '장바구니 제품 카테고리 ID',
    default: 0,
  })
  categoryId: number;

  @Column({
    type: 'bigint',
    nullable: false,
    comment: '장바구니 제품 ID',
  })
  productId: number;

  @Column({
    type: 'varchar',
    nullable: false,
    length: 50,
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
    nullable: true,
    length: 1,
    comment: '장바구니 제품 옵션 유무 (default "N")',
    default: 'N',
  })
  optionCheck: string;

  @Column({
    type: 'integer',
    nullable: true,
    comment: '장바구니 제품 옵션 ID',
    default: 0,
  })
  optionId: number;

  @Column({
    type: 'varchar',
    nullable: true,
    length: 50,
    comment: '장바구니 제품 옵션 명',
    default: null,
  })
  optionName: string;

  @Column({
    type: 'integer',
    nullable: true,
    comment: '장바구니 제품 옵션 가격',
    default: 0,
  })
  optionPrice: number;

  @Column({
    type: 'integer',
    nullable: false,
    comment: '장바구니 제품 총 가격',
  })
  totalPrice: number;

  @Column({
    type: 'varchar',
    nullable: false,
    length: 13,
    comment: '전화번호',
  })
  phone: string;

  @Column({
    type: 'varchar',
    nullable: false,
    length: 20,
    comment: '수령자 명',
  })
  recipientName: string;

  @Column({
    type: 'varchar',
    nullable: false,
    length: 15,
    comment: '배송 방법',
  })
  deliveryType: string;

  @Column({
    type: 'varchar',
    nullable: false,
    length: 100,
    comment: '배송지 주소',
  })
  deliveryAddress: string;

  @Column({
    type: 'integer',
    nullable: true,
    comment: '배송료',
    default: 0,
  })
  deliveryFee: number;

  @Column({
    type: 'bigint',
    nullable: true,
    comment: '등록하여 사용한 결제 수단 카드 ID',
    default: 0,
  })
  paymentMethodId: number;

  @Column({
    type: 'timestamp',
    nullable: false,
    comment: '주문 생성 일자',
    default: () => 'CURRENT_TIMESTAMP',
  })
  @CreateDateColumn({
    comment: '주문 생성 일자',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    nullable: true,
    comment: '주문 수정 일자',
    default: null,
  })
  @UpdateDateColumn({ comment: '주문 수정 일자', default: null })
  updatedAt: Date | null;

  @ManyToOne(() => User, (user) => user.orders, {
    onDelete: 'CASCADE',
    eager: false,
  })
  @JoinColumn({
    name: 'member_id',
    foreignKeyConstraintName: 'fk_order_member_id',
    referencedColumnName: 'id',
  })
  member: User;
}
