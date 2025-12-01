// 장바구니 추가 Request Dto
export interface CartInRequest {
  categoryId: number;
  categoryName: string;
  productId: number;
  productName: string;
  price: number;
  thumbImage: string;
  quantity: number;
  optionCheck: string;
  optionId: number;
  optionName: string;
  optionPrice: number;
  totalPrice: number;
}

// 장바구니 리스트 내 각 장바구니 정보 Response Dto
export interface CartInfoResponse {
  cartId: number;
  categoryId: number;
  categoryName: string;
  productId: number;
  productName: string;
  thumbImage: string;
  price: number;
  quantity: number;
  optionCheck: string;
  optionId: number;
  optionName: string;
  optionPrice: number;
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date | null;
}

// 장바구니 수정 Request Dto
export interface CartUpdateRequest {
  cartId: number;
  price: number;
  quantity: number;
  optionCheck: 'N' | 'Y';
  optionId: number | 0;
  optionName: string | null;
  optionPrice: number | 0;
  totalPrice: number;
}
