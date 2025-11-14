import { Categories, type Category } from '@basic-project/shared-types/item';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('products')
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  price: number;

  @Column('text', { array: true, nullable: true })
  images: string[] | null;

  @Column()
  description: string;

  @Column({ type: 'int', default: 0 })
  discountPrice: number;

  @Column({ type: 'timestamp', nullable: true })
  discountStartDate: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  discountEndDate: Date | null;

  @Column({
    type: 'enum',
    enum: Categories as unknown as string[],
    default: 'ETC',
  })
  category: Category;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  modifiedAt: Date | null;
}
