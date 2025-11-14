export const Categories = [
  'SOCCER',
  'BASEBALL',
  'BASKETBALL',
  'VOLLEYBALL',
  'ETC',
] as const;

export type Category = (typeof Categories)[number];

export interface Product {
  id: number;
  name: string;
  price: number;
  /** 상품 이미지(첫 번째 사진을 대표 이미지로 사용) */
  images: string[] | null;
  description: string;
  discountPrice: number;
  discountStartDate: string | null;
  discountEndDate: string | null;
  category: Category;
  createdAt: string;
  modifiedAt: string | null;
  // TODO: 옵션 여부에 대한 필드 추가 필요
}
