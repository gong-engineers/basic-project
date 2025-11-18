import { convertCategory } from '@/utils/item.util';
import { cart, item } from '@basic-project/shared-types';

export function buyNow(product: item.Product, quantity: number) {
  const { id, name, price, discountPrice, images, category } = product;

  const unitPrice =
    discountPrice && discountPrice !== 0 ? discountPrice : price;

  const buyNowItem: cart.CartInfoResponse = {
    cartId: 0, // 기본값
    categoryId: 0, // 기본값
    categoryName: convertCategory(category).label,
    productId: id,
    productName: name,
    thumbImage: images?.[0] ?? '',
    price: unitPrice,
    quantity,
    optionCheck: 'N', // 기본값
    optionId: 0, // 기본값
    optionName: '', // 기본값
    optionPrice: 0, // 기본값
    totalPrice: unitPrice * quantity,
    createdAt: new Date(),
    updatedAt: null,
  };

  sessionStorage.setItem('selectedCartItems', JSON.stringify([buyNowItem]));
}
