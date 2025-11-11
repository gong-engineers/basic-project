'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { cart } from '@basic-project/shared-types';

export default function Orders() {
  const router = useRouter();
  const [selectedItems] = useState<cart.CartInfoResponse[]>(() => {
    // 세션 스토리지에서 선택된 아이템 데이터 가져오기
    if (typeof window !== 'undefined') {
      const storedItems = sessionStorage.getItem('selectedCartItems');
      if (storedItems) {
        return JSON.parse(storedItems) as cart.CartInfoResponse[];
      }
    }
    return [];
  });
  const [currentStep, setCurrentStep] = useState(1);

  // 배송지 정보 상태
  const [recipientName, setRecipientName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [baseAddress, setBaseAddress] = useState('');
  const [detailAddress, setDetailAddress] = useState('');

  useEffect(() => {
    // 선택된 아이템이 없으면 장바구니로 리다이렉트
    if (selectedItems.length === 0) {
      alert('선택된 상품이 없습니다.');
      router.push('/carts');
    }
  }, [selectedItems, router]);

  // 총 금액 계산
  const totalAmount = selectedItems.reduce(
    (sum, item) => sum + (item.price + item.optionPrice) * item.quantity,
    0,
  );
  const shippingFee = totalAmount >= 50000 ? 0 : 3000;
  const finalAmount = totalAmount + shippingFee;

  // 우편번호 검색 (임시 함수)
  const handlePostalCodeSearch = () => {
    alert('우편번호 검색 기능은 추후 구현 예정입니다.');
  };

  // 다음 단계로 이동
  const handleNextStep = () => {
    if (!recipientName.trim()) {
      alert('받는 사람 이름을 입력해주세요.');
      return;
    }
    if (!phoneNumber.trim()) {
      alert('전화번호를 입력해주세요.');
      return;
    }
    if (!postalCode.trim() || !baseAddress.trim()) {
      alert('주소를 입력해주세요.');
      return;
    }
    if (!detailAddress.trim()) {
      alert('상세주소를 입력해주세요.');
      return;
    }

    // 다음 단계로 이동 (현재는 알림만)
    alert('다음 단계로 이동합니다. (배송방법 선택 페이지는 추후 구현 예정)');
  };

  return (
    <div className="min-h-screen bg-white py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 상단 단계 표시 */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4 sm:gap-8">
            {/* 1단계: 배송지 */}
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold text-white mb-2 ${currentStep >= 1 ? 'bg-blue-600' : 'bg-gray-300'}`}
              >
                1
              </div>
              <span
                className={`text-xs sm:text-sm font-medium ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-500'}`}
              >
                배송지
              </span>
            </div>

            {/* 구분선 */}
            <div className="flex-1 max-w-[100px] h-0.5 bg-gray-300 mb-6"></div>

            {/* 2단계: 배송방법 */}
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold text-white mb-2 ${currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`}
              >
                2
              </div>
              <span
                className={`text-xs sm:text-sm font-medium ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-500'}`}
              >
                배송방법
              </span>
            </div>

            {/* 구분선 */}
            <div className="flex-1 max-w-[100px] h-0.5 bg-gray-300 mb-6"></div>

            {/* 3단계: 결제 */}
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold text-white mb-2 ${currentStep >= 3 ? 'bg-blue-600' : 'bg-gray-300'}`}
              >
                3
              </div>
              <span
                className={`text-xs sm:text-sm font-medium ${currentStep >= 3 ? 'text-blue-600' : 'text-gray-500'}`}
              >
                결제
              </span>
            </div>
          </div>
        </div>

        {/* 메인 컨텐츠 */}
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
          {/* 왼쪽: 배송지 정보 */}
          <section className="flex-1">
            <div className="border border-blue-500 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <h2 className="text-xl font-bold">배송지 정보</h2>
              </div>

              <div className="space-y-6">
                {/* 받는 사람 */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    받는 사람
                  </label>
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="이름을 입력하세요"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* 전화번호 */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    전화번호
                  </label>
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="010-0000-0000"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* 주소 */}
                <div>
                  <label className="block text-sm font-medium mb-2">주소</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="우편번호"
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      readOnly
                    />
                    <button
                      onClick={handlePostalCodeSearch}
                      className="px-6 py-3 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-lg font-medium"
                    >
                      검색
                    </button>
                  </div>
                  <input
                    type="text"
                    value={baseAddress}
                    onChange={(e) => setBaseAddress(e.target.value)}
                    placeholder="기본주소"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                    readOnly
                  />
                  <input
                    type="text"
                    value={detailAddress}
                    onChange={(e) => setDetailAddress(e.target.value)}
                    placeholder="상세주소"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* 다음 단계로 버튼 */}
                <button
                  onClick={handleNextStep}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg"
                >
                  다음 단계로
                </button>
              </div>
            </div>
          </section>

          {/* 오른쪽: 주문 요약 */}
          <section className="w-full lg:w-96 flex-shrink-0">
            <div className="border border-gray-300 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-6">주문 요약</h3>

              {/* 주문 상품 목록 */}
              <div className="space-y-3 mb-6">
                {selectedItems.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-gray-700">
                      {item.productName} × {item.quantity}
                    </span>
                    <span className="font-medium">
                      {(
                        (item.price + item.optionPrice) *
                        item.quantity
                      ).toLocaleString()}
                      원
                    </span>
                  </div>
                ))}
              </div>

              {/* 배송료 */}
              <div className="flex justify-between text-sm mb-6">
                <span className="text-gray-700">배송료</span>
                <span className="font-medium">
                  {shippingFee === 0
                    ? '무료'
                    : `${shippingFee.toLocaleString()}원`}
                </span>
              </div>

              {/* 구분선 */}
              <div className="border-t border-gray-200 my-4"></div>

              {/* 합계 */}
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">합계</h3>
                <h3 className="text-2xl font-bold text-blue-600">
                  {finalAmount.toLocaleString()}원
                </h3>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* 하단: 결제 페이지 설명 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="bg-pink-50 border border-pink-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <span className="text-blue-600 text-xl">💳</span>
            <div>
              <h4 className="font-bold text-gray-900 mb-2">결제 페이지 설명</h4>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• 로그인한 사용자만 접근 가능</li>
                <li>• 3단계 결제 프로세스: 배송지 → 배송방법 → 결제</li>
                <li>• 기존 배송지 선택 또는 새로운 배송지 입력 가능</li>
                <li>• 배송방법 선택 (일반, 당일 등)</li>
                <li>• 결제 방법 선택 (신용카드, 계좌이체 등)</li>
                <li>• 결제 완료 후 주문 확정</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
