import { cart } from '@basic-project/shared-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CartUpdateDto implements cart.CartUpdateRequest {
  @ApiProperty({ description: '장바구니 ID' })
  @IsNotEmpty()
  @IsNumber()
  cartId: number;

  @ApiProperty({ description: '장바구니 가격' })
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty({ description: '장바구니 갯수' })
  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @ApiProperty({ description: '장바구니 옵션 유무' })
  @IsNotEmpty()
  @IsString()
  optionCheck: 'N' | 'Y';

  @ApiProperty({ description: '장바구니 옵션 ID', default: 0 })
  @IsNumber()
  optionId: number;

  @ApiProperty({ description: '장바구니 옵션 명' })
  @IsString()
  optionName: string | null;

  @ApiProperty({ description: '장바구니 옵션 가격', default: 0 })
  @IsNumber()
  optionPrice: number;

  @ApiProperty({ description: '장바구니 총 가격' })
  @IsNotEmpty()
  @IsNumber()
  totalPrice: number;
}
