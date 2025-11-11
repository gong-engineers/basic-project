import { payment } from '@basic-project/shared-types';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsArray,
  ValidateNested,
  Length,
} from 'class-validator';
import { EachOrderRequestDto } from './each-order-request.dto';
// import { Type } from 'class-transformer';

export class OrderRequestDto implements payment.PaymentMethodRequest {
  @ApiProperty({ description: '주문 정보' })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  orders: EachOrderRequestDto[];

  @ApiProperty({ description: '카드 소유자 이름' })
  @IsString()
  cardHolderName: string;

  @ApiProperty({ description: '카드 번호' })
  @IsNotEmpty()
  @IsString()
  @Length(16, 16)
  cardNumber: string;

  @ApiProperty({ description: '만료일' })
  @IsNotEmpty()
  @IsString()
  @Length(5, 5)
  expiry: string;

  @ApiProperty({ description: 'CVV' })
  @IsNotEmpty()
  @IsString()
  @Length(3, 3)
  cvv: string;

  @ApiProperty({ description: '비밀번호' })
  @IsNotEmpty()
  @IsString()
  @Length(4, 4)
  password: string;
}
