'use client';

import React from 'react';
import type { cart, common } from '@basic-project/shared-types';
import { client } from '../../../../lib/api';

import { API_URL } from '@/lib/api/utils';

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
  const [isUpdating, setIsUpdating] = React.useState(false); // API 호출 중 상태
  const [isDeleting, setIsDeleting] = React.useState(false); // 삭제 중 상태

  // 수량 변경 핸들러
  const handleQuantityChange = async (type: 'increase' | 'decrease') => {
    // 이미 업데이트 중이면 중복 호출 방지
    if (isUpdating) return;

    // 만약 수량이 1개 남았는데 수량을 감소시키려고 하면 삭제 여부를 물어본다.
    if (item.quantity === 1 && type === 'decrease') {
      const result = confirm(
        '장바구니에 상품이 1개 남았습니다. 삭제하시겠습니까?',
      );
      if (result) {
        deleteCart(item.cartId);
      }
      return;
    }

    const newQuantity =
      type === 'increase' ? item.quantity + 1 : item.quantity - 1;

    // 유효하지 않은 수량이면 중단
    if (newQuantity <= 0) return;

    setIsUpdating(true);

    // 낙관적 업데이트 (UI 먼저 업데이트)
    onQuantityChange(item.cartId, newQuantity);

    try {
      await client.put<cart.CartUpdateRequest, common.ResponseDto<null>>(
        `${API_URL}/api/v1/cart`,
        {
          cartId: item.cartId,
          quantity: newQuantity,
          price: item.price,
          optionCheck: item.optionCheck as 'N' | 'Y',
          optionId: item.optionId,
          optionName: item.optionName,
          optionPrice: item.optionPrice,
          totalPrice: (item.price + item.optionPrice) * newQuantity,
        },
        {
          mode: 'cors',
          credentials: 'include',
        },
      );
    } catch (error) {
      console.error('수량 변경 실패:', error);
      // 실패 시 롤백
      onQuantityChange(item.cartId, item.quantity);
    } finally {
      setIsUpdating(false);
    }
  };

  // 장바구니 삭제 핸들러
  const deleteCart = async (cartId: number) => {
    // 이미 삭제 중이면 중복 호출 방지
    if (isDeleting) return;

    setIsDeleting(true);

    // 낙관적 업데이트 (UI 먼저 업데이트)
    onDelete(cartId);

    try {
      await client.delete(`${API_URL}/api/v1/cart/${cartId}`, null, {
        mode: 'cors',
        credentials: 'include',
      });
    } catch (err) {
      console.error('장바구니 삭제 실패:', err);
      // 실패해도 이미 UI에서 제거되었으므로 롤백 하지 않음
    } finally {
      setIsDeleting(false);
    }
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
              className="px-3 py-1.5 sm:px-4 sm:py-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => handleQuantityChange('decrease')}
              disabled={isUpdating || isDeleting}
            >
              -
            </button>
            <span className="px-4 sm:px-6">{item.quantity}</span>
            <button
              className="px-3 py-1.5 sm:px-4 sm:py-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => handleQuantityChange('increase')}
              disabled={isUpdating || isDeleting}
            >
              +
            </button>
          </div>
          <button
            onClick={() => deleteCart(item.cartId)}
            className="text-xl text-gray-400 hover:text-gray-600 px-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isDeleting || isUpdating}
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}
