import { type Category, Categories } from '@basic-project/shared-types/product';
import { IsArray, IsIn, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsNumber()
  price: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @IsString()
  description: string;

  @IsOptional()
  @IsNumber()
  discountPrice?: number;

  @IsOptional()
  @IsString()
  discountStartDate?: string | null;

  @IsOptional()
  @IsString()
  discountEndDate?: string | null;

  @IsOptional()
  @IsIn(Categories as readonly string[])
  category?: Category;
}
