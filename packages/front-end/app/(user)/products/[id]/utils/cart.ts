import { client } from '@/lib/api';
import { checkDiscountPeriod } from '@/utils/date.util';
import { convertCategory } from '@/utils/item.util';
import { cart, common, item } from '@basic-project/shared-types';

export async function addToCart(product: item.Product, quantity: number) {
  const {
    id,
    name,
    price,
    discountPrice,
    discountStartDate,
    discountEndDate,
    category,
  } = product;

  const isDiscountActive = checkDiscountPeriod(
    discountStartDate,
    discountEndDate,
  );

  const unitPrice =
    discountPrice && discountPrice !== 0 && isDiscountActive
      ? discountPrice
      : price;

  const body: cart.CartInRequest = {
    categoryId: 0, // 기본값
    categoryName: convertCategory(category).label,
    productId: id,
    productName: name,
    price: unitPrice,
    quantity,
    optionCheck: 'N', // 기본값
    optionId: 0, // 기본값
    optionName: '', // 기본값
    optionPrice: 0, // 기본값
    totalPrice: unitPrice * quantity,
  };

  try {
    const res = await client.post<
      cart.CartInRequest,
      common.ResponseDto<cart.CartInfoResponse>
    >('http://localhost:3001/api/v1/cart', body, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('accessToken') || '',
      },
      mode: 'cors',
      credentials: 'include',
    });

    return res.data;
  } catch (err: unknown) {
    throw err;
  }
}
