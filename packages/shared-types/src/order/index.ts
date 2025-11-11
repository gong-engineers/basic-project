export interface OrderProgressRequest {
  cartId?: number;
  cartOrderCheck?: string;
  categoryId?: number;
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  optionCheck?: string;
  optionId?: number;
  optionName?: string;
  optionPrice?: number;
  totalPrice: number;
  deliveryAddress: string;
  deliveryFee: number;
}
