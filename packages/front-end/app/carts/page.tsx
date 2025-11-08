'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { client } from '../../lib/api';
import type { cart, common } from '@basic-project/shared-types';
import CartItem from './components/CartItem';

// 임시로 만든 로그인 응답 타입
interface LoginResponse {
  accessToken: string;
}

export default function Carts() {
  const [cartList, setCartList] = useState<cart.CartInfoResponse[]>([]); // 장바구니 리스트 상태 관리
  const router = useRouter(); // 페이지 이동을 위한 router 선언
  const [isLoading, setIsLoading] = useState(false); // 이미 렌더링된 상태에서 장바구니 리스트 조회를 위한 로딩 상태 관리 (또 반복적으로 렌더링되는 것을 방지하기 위한 state)

  useEffect(() => {
    // 장바구니 리스트 페이지를 테스트하기 위한 테스트 계정 강제 로그인
    (async () => {
      setIsLoading(true); // 로딩 시작
      try {
        // 강제 로그인 요청
        const loginResponse = await client.post<
          { email: string; password: string },
          LoginResponse
        >(
          'http://localhost:3001/auth/login',
          { email: 'test@gmail.com', password: 'testtest' },
          {
            mode: 'cors',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
          },
        );

        // 강제 로그인 후 AccessToken을 localstorage에 저장
        localStorage.setItem(
          'accessToken',
          'Bearer ' + loginResponse.accessToken,
        );

        // 강제 로그인 후 장바구니 조회
        const cartListResponse = await client.get<
          null,
          common.ResponseDto<cart.CartInfoResponse[]>
        >('http://localhost:3001/api/v1/cart', null, {
          headers: {
            Authorization: localStorage.getItem('accessToken') || '',
          },
          mode: 'cors',
          credentials: 'include',
        });

        setCartList(cartListResponse.data);
      } catch (err) {
        console.error('로그인 또는 장바구니 조회 실패:', err);
      } finally {
        setIsLoading(false); // 로딩 종료 (성공/실패 상관없이)
      }
    })();
  }, []); // 빈 배열: 컴포넌트 마운트 시 한 번만 실행

  // 수량 변경 핸들러
  const handleQuantityChange = (cartId: number, newQuantity: number) => {
    setCartList((prevList) =>
      prevList.map((item) =>
        item.cartId === cartId ? { ...item, quantity: newQuantity } : item,
      ),
    );
  };

  // 삭제 후 장바구니 리스트 업데이트 핸들러
  const deleteCart = async (cartId: number) => {
    setCartList((prevList) =>
      prevList.filter((item) => item.cartId !== cartId),
    );
  };

  // 총 금액 계산
  const totalAmount = cartList.reduce(
    (sum, item) => sum + (item.price + item.optionPrice) * item.quantity,
    0,
  );
  const shippingFee = totalAmount >= 50000 ? 0 : 3000; // 배송비 기준을 50000원으로 설정하여 그에 따른 배송비 출력
  const finalAmount = totalAmount + shippingFee; // 배송비와 총 금액 계산

  return isLoading ? (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  ) : (
    <div className="min-h-screen bg-white py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
          {/* 왼쪽: 장바구니 */}
          <section className="flex-1 w-full lg:w-auto">
            {/* 장바구니 상단 영역 */}
            <div className="border border-gray-300 rounded-lg p-4 sm:p-6 mb-4">
              <h2 className="text-xl sm:text-2xl font-bold">장바구니</h2>
              <p className="text-sm sm:text-base text-gray-600">
                {cartList.length}개 상품
              </p>
            </div>

            {/* 장바구니 제품 리스트 */}
            <div className="flex flex-col gap-3 sm:gap-4">
              {cartList.length !== 0 ? (
                cartList.map((item, index) => {
                  return (
                    <CartItem
                      key={index}
                      item={item}
                      onQuantityChange={handleQuantityChange}
                      onDelete={deleteCart}
                    />
                  );
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
                <button
                  onClick={() => router.push('/')}
                  className="w-full border border-gray-300 hover:bg-gray-50 font-medium py-2.5 sm:py-3 px-4 rounded-lg text-sm sm:text-base"
                >
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
