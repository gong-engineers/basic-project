import { type Category, Categories } from '@basic-project/shared-types/item';
import {
  IsArray,
  IsIn,
  IsISO8601,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

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
  @IsISO8601()
  discountStartDate?: string | null;

  @IsOptional()
  @IsISO8601()
  discountEndDate?: string | null;

  @IsOptional()
  @IsIn(Categories as readonly string[])
  category?: Category;
}
