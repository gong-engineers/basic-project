import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { GetProductDto } from './dto/get-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductRepository } from './product.repository';
import { ConfigService } from '@nestjs/config';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class ProductService {
  private readonly s3: S3Client;
  constructor(
    private readonly productRepo: ProductRepository,
    private readonly configService: ConfigService,
  ) {
    this.s3 = new S3Client({
      region: this.configService.get<string>('AWS_REGION')!,
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID')!,
        secretAccessKey: this.configService.get<string>(
          'AWS_SECRET_ACCESS_KEY',
        )!,
      },
    });
  }

  async getPresignedUrl(
    fileType: string,
  ): Promise<{ presignedUrl: string; fileUrl: string }> {
    const bucket = this.configService.get<string>('AWS_S3_BUCKET_NAME');
    const region = this.configService.get<string>('AWS_REGION');

    const fileExtension = fileType.split('/')[1] || 'jpg';
    const key = `${randomUUID()}.${fileExtension}`;

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: fileType,
    });

    const presignedUrl = await getSignedUrl(this.s3, command, {
      expiresIn: 600,
    });
    const fileUrl = `https://${bucket}.s3.${region}.amazonaws.com/${key}`;

    return { presignedUrl, fileUrl };
  }

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
