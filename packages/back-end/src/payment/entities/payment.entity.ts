import {
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity('payment_methods')
export class PaymentMethod {
  @PrimaryGeneratedColumn()
  paymentMethodId: number;

  @Column({
    type: 'varchar',
    nullable: false,
    length: 50,
    comment: '카드 소유자 이름',
    default: null,
  })
  cardHolderName: string;

  @Column({
    type: 'varchar',
    nullable: false,
    length: 16,
    comment: '카드 번호',
    unique: true,
  })
  cardNumber: string;

  @Column({
    type: 'char',
    nullable: false,
    length: 5,
    comment: '만료일',
  })
  expiry: string;

  @Column({
    type: 'char',
    nullable: false,
    length: 3,
    comment: 'CVV',
  })
  cvv: string;

  @Column({
    type: 'varchar',
    nullable: false,
    length: 100,
    comment: '비밀번호',
  })
  password: string;

  @ManyToOne(() => User, (user) => user.paymentMethods, {
    onDelete: 'CASCADE',
    eager: false,
  })
  @JoinColumn({
    name: 'member_id',
    foreignKeyConstraintName: 'fk_payment_method_member_id',
    referencedColumnName: 'id',
  })
  member: User;

  @Column({
    type: 'timestamp',
    nullable: false,
    comment: '결제 카드 생성 일자',
    default: () => 'CURRENT_TIMESTAMP',
  })
  @CreateDateColumn({
    comment: '결제 카드 생성 일자',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    nullable: true,
    comment: '결제 카드 정보 수정 일자',
    default: null,
  })
  @UpdateDateColumn({ comment: '결제 카드 정보 수정 일자', default: null })
  updatedAt: Date | null;
}
