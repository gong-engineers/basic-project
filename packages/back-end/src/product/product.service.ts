import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { GetProductDto } from './dto/get-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductRepository } from './product.repository';

@Injectable()
export class ProductService {
  constructor(private readonly productRepo: ProductRepository) {}

  async create(dto: CreateProductDto) {
    return this.productRepo.createProduct(dto);
  }

  async findAll(query: GetProductDto) {
    return this.productRepo.findAllProducts(query);
  }

  async findOne(id: number) {
    const product = await this.productRepo.findProduct(id);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async update(id: number, dto: UpdateProductDto) {
    const product = await this.productRepo.updateProduct(id, dto);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async remove(id: number) {
    const product = await this.productRepo.removeProduct(id);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return { success: true };
  }
}
