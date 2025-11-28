import { order } from '@basic-project/shared-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Length } from 'class-validator';

export class PurchaseConfirmRequestDto implements order.PurchaseConfirmRequest {
  @ApiProperty({ description: '주문 ID' })
  @IsNotEmpty()
  @IsNumber()
  orderId: number;

  @ApiProperty({ description: '구매 확정 여부' })
  @IsNotEmpty()
  @IsString()
  @Length(1, 1)
  purchaseConfirm: string;
}
