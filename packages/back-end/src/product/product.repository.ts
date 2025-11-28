import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { toDate } from 'src/utils/date.util';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { GetProductDto } from './dto/get-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductEntity } from './entities/product.entity';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepo: Repository<ProductEntity>,
  ) {}

  async createProduct(dto: CreateProductDto) {
    const entity = this.productRepo.create({
      ...dto,
      discountStartDate: toDate(dto.discountStartDate),
      discountEndDate: toDate(dto.discountEndDate),
    });

    return this.productRepo.save(entity);
  }

  async findAllProducts(query: GetProductDto) {
    const { category, keyword, page = 1, limit = 12 } = query;
    const qb = this.productRepo.createQueryBuilder('product');

    if (category) {
      qb.andWhere('product.category = :category', { category });
    }

    if (keyword) {
      qb.andWhere(
        '(product.name ILIKE :keyword OR product.description ILIKE :keyword)',
        {
          keyword: `%${keyword}%`,
        },
      );
    }

    qb.orderBy('product.createdAt', 'DESC');
    qb.skip((page - 1) * limit).take(limit);

    const [items, total] = await qb.getManyAndCount();

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findProduct(id: number) {
    return this.productRepo.findOne({ where: { id } });
  }

  async updateProduct(id: number, dto: UpdateProductDto) {
    const product = await this.productRepo.findOne({ where: { id } });

    if (!product) {
      return null;
    }

    const updatedProduct = {
      ...product,
      ...dto,
      discountStartDate: toDate(dto.discountStartDate),
      discountEndDate: toDate(dto.discountEndDate),
    };

    await this.productRepo.save(updatedProduct);
    return updatedProduct;
  }

  async removeProduct(id: number) {
    const product = await this.productRepo.findOne({ where: { id } });

    if (!product) {
      return null;
    }

    await this.productRepo.delete(id);
    return product;
  }
}
