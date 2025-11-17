import { item } from '@basic-project/shared-types';
import { IsIn, IsOptional, IsString } from 'class-validator';

export class GetProductDto {
  // todo: 페이지네이션 관련 추가

  @IsOptional()
  @IsIn(item.Categories)
  category?: item.Category;

  @IsOptional()
  @IsString()
  keyword?: string;
}
