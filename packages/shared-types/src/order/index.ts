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

export interface OrderInfoResponse {
  orderId: number;
  orderNumber: string;
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  optionCheck: string;
  optionId: number;
  optionName: string;
  optionPrice: number;
  totalPrice: number;
  phone: string;
  recipientName: string;
  deliveryType: string;
  deliveryAddress: string;
  deliveryFee: number;
  purchaseConfirm: string;
  createdAt: Date;
}

export interface PurchaseConfirmRequest {
  orderId: number;
  purchaseConfirm: string;
}
