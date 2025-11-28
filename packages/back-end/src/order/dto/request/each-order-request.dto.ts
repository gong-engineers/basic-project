import { order } from '@basic-project/shared-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class EachOrderRequestDto implements order.OrderProgressRequest {
  @ApiProperty({ description: '장바구니 ID' })
  @IsNumber()
  cartId?: number;

  @ApiProperty({ description: '장바구니 체크' })
  @IsString()
  cartOrderCheck?: string;

  @ApiProperty({ description: '장바구니 카테고리 ID' })
  @IsNumber()
  categoryId?: number;

  @ApiProperty({ description: '장바구니 제품 ID' })
  @IsNumber()
  productId: number;

  @ApiProperty({ description: '장바구니 제품 명' })
  @IsString()
  productName: string;

  @ApiProperty({ description: '장바구니 제품 가격' })
  @IsNumber()
  price: number;

  @ApiProperty({ description: '장바구니 제품 갯수' })
  @IsNumber()
  quantity: number;

  @ApiProperty({ description: '장바구니 제품 옵션 유무' })
  @IsString()
  optionCheck?: string;

  @ApiProperty({ description: '장바구니 제품 옵션 ID' })
  @IsNumber()
  optionId?: number;

  @ApiProperty({ description: '장바구니 제품 옵션 명' })
  @IsString()
  optionName?: string;

  @ApiProperty({ description: '장바구니 제품 옵션 가격' })
  @IsNumber()
  optionPrice?: number;

  @ApiProperty({ description: '장바구니 제품 총 가격' })
  @IsNumber()
  totalPrice: number;

  @ApiProperty({ description: '배송지 주소' })
  @IsString()
  deliveryAddress: string;

  @ApiProperty({ description: '배송료' })
  @IsNumber()
  deliveryFee: number;
}
