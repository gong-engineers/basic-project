export interface CartInRequest {
    categoryId: number;
    categoryName: string;
    productId: number;
    productName: string;
    price: number;
    quantity: number;
    optionCheck: string;
    optionId: number;
    optionName: string;
    optionPrice: number;
    totalPrice: number;
}
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
export interface CartUpdateRequest {
    cartId: number;
    price: number;
    quantity: number;
    optionCheck: "N" | "Y";
    optionId: number | 0;
    optionName: string | null;
    optionPrice: number | 0;
    totalPrice: number;
}
