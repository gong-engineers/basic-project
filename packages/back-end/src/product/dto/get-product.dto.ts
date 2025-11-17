import { Categories, type Category } from '@basic-project/shared-types/item';
import { IsIn, IsOptional, IsString } from 'class-validator';

export class GetProductDto {
  // todo: 페이지네이션 관련 추가

  @IsOptional()
  @IsIn([...Categories])
  category?: Category;

  @IsOptional()
  @IsString()
  keyword?: string;
}
