'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { client } from '../../lib/api';
import type { cart, common } from '@basic-project/shared-types';
import CartItem from './components/CartItem';

export default function Carts() {
  const [cartList, setCartList] = useState<cart.CartInfoResponse[]>([]); // 장바구니 리스트 상태 관리
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set()); // 선택된 아이템의 cartId를 저장
  const router = useRouter(); // 페이지 이동을 위한 router 선언
  const [isLoading, setIsLoading] = useState(false); // 이미 렌더링된 상태에서 장바구니 리스트 조회를 위한 로딩 상태 관리 (또 반복적으로 렌더링되는 것을 방지하기 위한 state)
  const hasFetched = useRef(false); // API 호출 여부를 추적 (React Strict Mode 대응)

  useEffect(() => {
    // 이미 한 번 실행되었으면 중복 호출 방지
    // React Strict Mode에서는 useEffect가 두 번 실행되는데, state로는 이를 막을 수 없고 State는 재마운트 시 초기화되기 때문
    // 때문에 useRef를 사용하여 중복 방지
    if (hasFetched.current) return;
    hasFetched.current = true;

    const isCancelled = false; // cleanup을 위한 플래그

    (async () => {
      setIsLoading(true); // 로딩 시작
      try {
        // 장바구니 조회
        const cartListResponse = await client.get<
          null,
          common.ResponseDto<cart.CartInfoResponse[]>
        >('http://localhost:3001/api/v1/cart', null, {
          mode: 'cors',
          credentials: 'include',
        });

        // 컴포넌트가 unmount되었으면 state 업데이트 하지 않음
        if (isCancelled) return;

        setCartList(cartListResponse.data);
      } catch (err) {
        if (!isCancelled) {
          console.error('장바구니 조회 실패:', err);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false); // 로딩 종료 (성공/실패 상관없이)
        }
      }
    })();
  }, []);

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
    // 선택된 항목에서도 제거
    setSelectedItems((prev) => {
      const newSet = new Set(prev);
      newSet.delete(cartId);
      return newSet;
    });
  };

  // 체크박스 토글 핸들러
  const handleToggleSelect =
    (cartId: number, price: number, optionPrice: number, quantity: number) =>
    () => {
      setSelectedItems((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(cartId)) {
          newSet.delete(cartId);
        } else {
          newSet.add(cartId);
        }
        return newSet;
      });
    };

  // 결제하기 버튼 핸들러
  const handleCheckout = () => {
    if (selectedItems.size === 0) {
      alert('결제할 상품을 선택해주세요.');
      return;
    }

    // 선택된 아이템들의 데이터 추출
    const selectedCartItems = cartList.filter((item) =>
      selectedItems.has(item.cartId),
    );

    // 선택된 아이템 데이터를 세션 스토리지에 저장
    sessionStorage.setItem(
      'selectedCartItems',
      JSON.stringify(selectedCartItems),
    );

    // 주문 페이지로 이동
    router.push('/orders');
  };

  // 선택된 아이템들의 총 금액 계산 (계산된 값 - derived state)
  const totalAmount = cartList
    .filter((item) => selectedItems.has(item.cartId))
    .reduce(
      (sum, item) => sum + (item.price + item.optionPrice) * item.quantity,
      0,
    );

  const shippingFee = totalAmount >= 50000 ? 0 : totalAmount === 0 ? 0 : 3000; // 배송비 기준을 50000원으로 설정하여 그에 따른 배송비 출력
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
                      isSelected={selectedItems.has(item.cartId)}
                      onToggleSelect={handleToggleSelect}
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
                <button
                  onClick={handleCheckout}
                  disabled={cartList.length === 0}
                  style={{
                    backgroundColor: cartList.length === 0 ? '#ccc' : '#007bff',
                    cursor: cartList.length === 0 ? 'not-allowed' : 'pointer',
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 sm:py-3 px-4 rounded-lg flex items-center justify-center gap-2 text-sm sm:text-base"
                >
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
