import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { GetProductDto } from './dto/get-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductService } from './product.service';
import { CreatePresignedUrlDto } from './dto/create-presigned-url.dto';

@Controller('api/v1/products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('presigned-url')
  async getPresignedUrl(@Body() createPresignedUrlDto: CreatePresignedUrlDto) {
    const { fileType } = createPresignedUrlDto;
    return this.productService.getPresignedUrl(fileType);
  }

  @Post()
  createProduct(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  getProducts(@Query() query: GetProductDto) {
    return this.productService.findAll(query);
  }

  @Get(':id')
  getProduct(@Param('id') id: number) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  updateProduct(
    @Param('id') id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  removeProduct(@Param('id') id: number) {
    return this.productService.remove(id);
  }
}
