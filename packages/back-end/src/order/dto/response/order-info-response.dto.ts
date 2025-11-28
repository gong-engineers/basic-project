import { order } from '@basic-project/shared-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsDate } from 'class-validator';

export class OrderInfoResponseDto implements order.OrderInfoResponse {
  @ApiProperty({ description: '주문 ID' })
  @IsNumber()
  orderId: number;

  @ApiProperty({ description: '주문 번호' })
  @IsString()
  orderNumber: string;

  @ApiProperty({ description: '제품 ID' })
  @IsNumber()
  productId: number;

  @ApiProperty({ description: '제품 명' })
  @IsString()
  productName: string;

  @ApiProperty({ description: '제품 가격' })
  @IsNumber()
  price: number;

  @ApiProperty({ description: '제품 갯수' })
  @IsNumber()
  quantity: number;

  @ApiProperty({ description: '제품 옵션 유무' })
  @IsString()
  optionCheck: string;

  @ApiProperty({ description: '제품 옵션 ID' })
  @IsNumber()
  optionId: number;

  @ApiProperty({ description: '제품 옵션 명' })
  @IsString()
  optionName: string;

  @ApiProperty({ description: '제품 옵션 가격' })
  @IsNumber()
  optionPrice: number;

  @ApiProperty({ description: '제품 총 가격' })
  @IsNumber()
  totalPrice: number;

  @ApiProperty({ description: '전화번호' })
  @IsString()
  phone: string;

  @ApiProperty({ description: '수령자 명' })
  @IsString()
  recipientName: string;

  @ApiProperty({ description: '배송 방법' })
  @IsString()
  deliveryType: string;

  @ApiProperty({ description: '배송지 주소' })
  @IsString()
  deliveryAddress: string;

  @ApiProperty({ description: '배송료' })
  @IsNumber()
  deliveryFee: number;

  @ApiProperty({ description: '구매 확정 여부' })
  @IsString()
  purchaseConfirm: string;

  @ApiProperty({ description: '주문 생성 일자' })
  @IsDate()
  createdAt: Date;
}
