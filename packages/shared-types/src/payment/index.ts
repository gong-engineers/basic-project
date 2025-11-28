export interface PaymentMethodRequest {
  cardHolderName: string;
  cardNumber: string;
  expiry: string;
  cvv: string;
  password: string;
}
