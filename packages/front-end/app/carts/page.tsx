'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import '../../lib/api/index';

function CartItem({ item }: { item: CartItem }) {
  return (
    <div className="w-full border border-gray-200 rounded-lg p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
        {/* 상품 이미지 */}
        <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center bg-gray-100 rounded-lg flex-shrink-0">
          <span className="text-4xl sm:text-5xl">📦</span>
        </div>

        {/* 상품 정보 */}
        <div className="flex-1 min-w-0">
          <h5 className="text-base sm:text-lg font-semibold mb-1">
            {item.name}
          </h5>
          <p className="text-xs sm:text-sm text-gray-600 mb-2">
            {item.description}
          </p>
          <h4 className="text-lg sm:text-xl font-bold">
            {item.price.toLocaleString()}원
          </h4>
        </div>

        {/* 수량 조절 및 삭제 버튼 */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center border border-gray-300 rounded text-sm">
            <button className="px-3 py-1.5 sm:px-4 sm:py-2 hover:bg-gray-100">
              -
            </button>
            <span className="px-4 sm:px-6">{item.quantity}</span>
            <button className="px-3 py-1.5 sm:px-4 sm:py-2 hover:bg-gray-100">
              +
            </button>
          </div>
          <button className="text-xl text-gray-400 hover:text-gray-600 px-2  hover:bg-gray-100">
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}

interface CartItem {
  image: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
}

const cartItems: CartItem[] = [
  {
    image: 'https://via.placeholder.com/150',
    name: '상품 1',
    description: '상품 상세정보',
    price: 29900,
    quantity: 2,
  },
  {
    image: 'https://via.placeholder.com/150',
    name: '상품 2',
    description: '상품 상세정보',
    price: 39900,
    quantity: 1,
  },
  {
    image: 'https://via.placeholder.com/150',
    name: '상품 3',
    description: '상품 상세정보',
    price: 49900,
    quantity: 1,
  },
];

export default function Carts() {
  // 총 금액 계산
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shippingFee = totalAmount >= 50000 ? 0 : 3000;
  const finalAmount = totalAmount + shippingFee;

  return (
    <div className="min-h-screen bg-white py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
          {/* 왼쪽: 장바구니 */}
          <section className="flex-1 w-full lg:w-auto">
            {/* 장바구니 상단 영역 */}
            <div className="border border-gray-200 rounded-lg p-4 sm:p-6 mb-4">
              <h2 className="text-xl sm:text-2xl font-bold">장바구니</h2>
              <p className="text-sm sm:text-base text-gray-600">
                {cartItems.length}개 상품
              </p>
            </div>

            {/* 장바구니 제품 리스트 */}
            <div className="flex flex-col gap-3 sm:gap-4">
              {cartItems.length !== 0 ? (
                cartItems.map((item, index) => {
                  return <CartItem key={index} item={item} />;
                })
              ) : (
                <div className="text-center py-8 text-gray-500">
                  장바구니가 비었습니다.
                </div>
              )}
            </div>
          </section>

          {/* 오른쪽: 주문 요약 */}
          <section className="w-full lg:w-96 flex-shrink-0">
            <div className="border border-gray-300 rounded-lg p-4 sm:p-6 lg:sticky lg:top-4">
              <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">
                주문 요약
              </h3>

              {/* 주문 요약 내용 */}
              <div className="space-y-2 sm:space-y-3 mb-4">
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-gray-700">상품 소계</span>
                  <span className="font-medium">
                    {totalAmount.toLocaleString()}원
                  </span>
                </div>
                <div className="flex justify-between text-sm sm:text-base">
                  <span className="text-gray-700">배송료</span>
                  <span className="font-medium">
                    {shippingFee === 0
                      ? '무료'
                      : `${shippingFee.toLocaleString()}원`}
                  </span>
                </div>
              </div>

              {/* 구분선 */}
              <div className="border-t border-gray-200 my-3 sm:my-4"></div>

              {/* 합계 */}
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-bold">합계</h3>
                <h3 className="text-xl sm:text-2xl font-bold text-blue-600">
                  {finalAmount.toLocaleString()}원
                </h3>
              </div>

              {/* 버튼 영역 */}
              <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 sm:py-3 px-4 rounded-lg flex items-center justify-center gap-2 text-sm sm:text-base">
                  결제하기 →
                </button>
                <button className="w-full border border-gray-300 hover:bg-gray-50 font-medium py-2.5 sm:py-3 px-4 rounded-lg text-sm sm:text-base">
                  계속 쇼핑
                </button>
              </div>

              {/* 배송 정보 알림 영역 */}
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 sm:p-4">
                <p className="text-blue-800 font-semibold mb-1 text-sm sm:text-base">
                  배송 정보
                </p>
                <p className="text-blue-600 text-xs sm:text-sm">
                  50,000원 이상 구매 시 배송료 무료
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
