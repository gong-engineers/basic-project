'use client';

import type { cart, common } from '@basic-project/shared-types';
import { client } from '../../../lib/api';

interface CartItemProps {
  item: cart.CartInfoResponse;
  onQuantityChange: (cartId: number, newQuantity: number) => void;
  onDelete: (cartId: number) => void;
  isSelected: boolean;
  onToggleSelect: (
    cartId: number,
    price: number,
    optionPrice: number,
    quantity: number,
  ) => () => void;
}

export default function CartItem({
  item,
  onQuantityChange,
  onDelete,
  isSelected,
  onToggleSelect,
}: CartItemProps) {
  // 수량 변경 핸들러
  const handleQuantityChange = async (type: 'increase' | 'decrease') => {
    // 만약 수량이 1개 남았는데 수량을 감소시키려고 하면 삭제 여부를 물어본다.
    if (item.quantity === 1 && type === 'decrease') {
      const result = confirm(
        '장바구니에 상품이 1개 남았습니다. 삭제하시겠습니까?',
      );
      if (result) {
        deleteCart(item.cartId);
      }
    }

    try {
      await client.put<cart.CartUpdateRequest, common.ResponseDto<null>>(
        `http://localhost:3001/api/v1/cart`,
        {
          cartId: item.cartId,
          quantity: type === 'increase' ? item.quantity + 1 : item.quantity - 1,
          price: item.price,
          optionCheck: item.optionCheck as 'N' | 'Y',
          optionId: item.optionId,
          optionName: item.optionName,
          optionPrice: item.optionPrice,
          totalPrice: (item.price + item.optionPrice) * item.quantity,
        },
        {
          headers: {
            Authorization: localStorage.getItem('accessToken') || '',
            'Content-Type': 'application/json',
          },
          mode: 'cors',
          credentials: 'include',
        },
      );
    } catch (error) {
      console.error('수량 변경 실패:', error);
    }

    // 새로운 수량으로 업데이트
    const newQuantity =
      type === 'increase' ? item.quantity + 1 : item.quantity - 1;
    if (newQuantity > 0) {
      onQuantityChange(item.cartId, newQuantity);
    }
  };

  // 장바구니 삭제 핸들러
  const deleteCart = async (cartId: number) => {
    try {
      await client.delete(`http://localhost:3001/api/v1/cart/${cartId}`, null, {
        headers: {
          Authorization: localStorage.getItem('accessToken') || '',
        },
        mode: 'cors',
        credentials: 'include',
      });
    } catch (err) {
      console.error('장바구니 삭제 실패:', err);
    }

    onDelete(cartId);
  };

  return (
    <div className="w-full border border-gray-300 rounded-lg p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
        <input type="hidden" value={item.cartId} />
        <input type="hidden" value={item.optionCheck} />
        <input type="hidden" value={item.optionId} />
        <input
          type="hidden"
          value={item.optionName == null ? '' : item.optionName}
        />
        <input type="hidden" value={item.optionPrice} />
        <input type="hidden" value={item.totalPrice} />

        {/* 체크박스 */}
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onToggleSelect(
              item.cartId,
              item.price,
              item.optionPrice,
              item.quantity,
            )}
            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
          />
        </div>

        {/* 상품 이미지 */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center bg-gray-100 rounded-lg flex-shrink-0">
          <span className="text-4xl sm:text-5xl">
            {item.thumbImage == null}📦
          </span>
        </div>

        {/* 상품 정보 */}
        <div className="flex-1 min-w-0">
          <input type="hidden" value={item.categoryId} />
          <input type="hidden" value={item.productId} />
          <h5 className="text-base sm:text-lg font-semibold mb-1">
            {item.productName}
          </h5>
          <p className="text-xs sm:text-sm text-gray-600 mb-2">
            {item.categoryName}
          </p>
          <h4 className="text-lg sm:text-xl font-bold">
            {(item.price + item.optionPrice * item.quantity).toLocaleString()}원
          </h4>
        </div>

        {/* 수량 조절 및 삭제 버튼 */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center border border-gray-300 rounded text-sm">
            <button
              className="px-3 py-1.5 sm:px-4 sm:py-2 hover:bg-gray-100"
              onClick={() => handleQuantityChange('decrease')}
            >
              -
            </button>
            <span className="px-4 sm:px-6">{item.quantity}</span>
            <button
              className="px-3 py-1.5 sm:px-4 sm:py-2 hover:bg-gray-100"
              onClick={() => handleQuantityChange('increase')}
            >
              +
            </button>
          </div>
          <button
            onClick={() => deleteCart(item.cartId)}
            className="text-xl text-gray-400 hover:text-gray-600 px-2  hover:bg-gray-100"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}
