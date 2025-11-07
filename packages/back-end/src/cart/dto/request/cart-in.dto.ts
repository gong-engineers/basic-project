import { CartInRequest } from '@basic-project/shared-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CartInDto implements CartInRequest {
  @ApiProperty({
    description: '장바구니 제품 카테고리 ID',
  })
  @IsNotEmpty()
  @IsNumber()
  categoryId: number;

  @ApiProperty({ description: '장바구니 제품 카테고리 명' })
  @IsNotEmpty()
  @IsString()
  categoryName: string;

  @ApiProperty({ description: '장바구니 제품 ID' })
  @IsNotEmpty()
  @IsNumber()
  productId: number;

  @ApiProperty({ description: '장바구니 제품 명' })
  @IsNotEmpty()
  @IsString()
  productName: string;

  @ApiProperty({ description: '장바구니 제품 가격' })
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty({ description: '장바구니 제품 갯수' })
  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @ApiProperty({ description: '장바구니 옵션 유무', default: 'N' })
  @IsNotEmpty()
  @IsString()
  optionCheck: string;

  @ApiProperty({ description: '장바구니 옵션 ID', default: 0 })
  @IsNumber()
  optionId: number;

  @ApiProperty({ description: '장바구니 옵션 명', default: null })
  @IsString()
  optionName: string;

  @ApiProperty({ description: '장바구니 옵션 가격', default: 0 })
  @IsNumber()
  optionPrice: number;

  @ApiProperty({ description: '장바구니 총 가격' })
  @IsNotEmpty()
  @IsNumber()
  totalPrice: number;
}
