'use client';

import type { cart } from '@basic-project/shared-types';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type DeliveryMethod = 'same-day' | 'standard';
import { API_URL } from '@/lib/api/utils';

interface SavedCard {
  id: number;
  cardHolderName: string;
  cardNumber: string;
  expiry: string;
  maskedNumber: string;
}

interface DaumPostcodeData {
  address: string;
  addressType: string;
  bname: string;
  buildingName: string;
  zonecode: string;
  roadAddress: string;
}

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

  // 배송 방법 상태
  const [deliveryMethod, setDeliveryMethod] =
    useState<DeliveryMethod>('standard');

  // 결제 정보 상태
  const [useExistingCard, setUseExistingCard] = useState(false);
  const [existingCards, setExistingCards] = useState<SavedCard[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
  const [cardHolderName, setCardHolderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // 선택된 아이템이 없으면 장바구니로 리다이렉트
    if (selectedItems.length === 0) {
      alert('선택된 상품이 없습니다.');
      router.push('/carts');
    }
  }, [selectedItems, router]);

  // 기존 등록된 카드 정보 로드 (시뮬레이션)
  useEffect(() => {
    // 실제로는 API에서 가져와야 하지만, 여기서는 로컬 스토리지에서 가져옴
    const savedCards = localStorage.getItem('savedCards');
    if (savedCards) {
      setExistingCards(JSON.parse(savedCards));
    }
  }, []);

  // 총 금액 계산
  const totalAmount = selectedItems.reduce(
    (sum, item) => sum + (item.price + item.optionPrice) * item.quantity,
    0,
  );
  const shippingFee = totalAmount >= 50000 ? 0 : 3000;
  const deliveryFee = deliveryMethod === 'same-day' ? 5000 : 0;
  const finalAmount = totalAmount + shippingFee + deliveryFee;

  // 카카오 주소 검색 스크립트 로드
  useEffect(() => {
    const script = document.createElement('script');
    script.src =
      '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // 우편번호 검색 함수
  const handlePostalCodeSearch = () => {
    // Daum 우편번호 서비스가 로드되었는지 확인
    const daum = (
      window as Window & {
        daum?: {
          Postcode: new (options: {
            oncomplete: (data: DaumPostcodeData) => void;
            width: string;
            height: string;
          }) => { open: () => void };
        };
      }
    ).daum;
    if (typeof window === 'undefined' || !daum) {
      alert('주소 검색 서비스를 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    new daum.Postcode({
      oncomplete: function (data: DaumPostcodeData) {
        // 도로명 주소와 지번 주소 중 선택한 주소 사용
        let fullAddress = data.address; // 기본 주소 (지번)
        let extraAddress = ''; // 참고항목

        // 사용자가 도로명 주소를 선택한 경우
        if (data.addressType === 'R') {
          fullAddress = data.roadAddress;

          // 법정동명이 있을 경우 추가
          if (data.bname !== '') {
            extraAddress += data.bname;
          }
          // 건물명이 있을 경우 추가
          if (data.buildingName !== '') {
            extraAddress +=
              extraAddress !== ''
                ? `, ${data.buildingName}`
                : data.buildingName;
          }
          // 참고항목이 있을 경우 괄호로 추가
          fullAddress += extraAddress !== '' ? ` (${extraAddress})` : '';
        }

        // 우편번호와 주소 정보를 state에 설정
        setPostalCode(data.zonecode);
        setBaseAddress(fullAddress);

        // 상세주소 입력란에 포커스
        document.getElementById('detailAddress')?.focus();
      },
      // 팝업 크기 설정
      width: '100%',
      height: '100%',
    }).open();
  };

  // 1단계: 배송지 정보 검증 및 다음 단계로 이동
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

    // 배송지 정보 저장 (세션 스토리지)
    const shippingInfo = {
      recipientName,
      phoneNumber,
      postalCode,
      baseAddress,
      detailAddress,
    };
    sessionStorage.setItem('shippingInfo', JSON.stringify(shippingInfo));

    // 다음 단계로 이동
    setCurrentStep(2);
  };

  // 2단계: 배송 방법 검증 및 다음 단계로 이동
  const handleDeliveryMethodNext = () => {
    if (!deliveryMethod) {
      alert('배송 방법을 선택해주세요.');
      return;
    }

    // 배송 방법 저장 (세션 스토리지)
    sessionStorage.setItem('deliveryMethod', deliveryMethod);

    // 다음 단계로 이동 (결제 단계)
    setCurrentStep(3);
  };

  // 이전 단계로 이동
  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // 카드 번호 포맷팅
  const formatCardNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '').slice(0, 16);
    setCardNumber(numbers);
  };

  // 만료일 포맷팅 (MM/YY)
  const formatExpiry = (value: string) => {
    const numbers = value.replace(/\D/g, '').slice(0, 4);
    if (numbers.length >= 2) {
      setExpiry(numbers.slice(0, 2) + '/' + numbers.slice(2));
    } else {
      setExpiry(numbers);
    }
  };

  // CVV 포맷팅
  const formatCVV = (value: string) => {
    const numbers = value.replace(/\D/g, '').slice(0, 3);
    setCvv(numbers);
  };

  // 비밀번호 포맷팅
  const formatPassword = (value: string) => {
    const numbers = value.replace(/\D/g, '').slice(0, 4);
    setPassword(numbers);
  };

  // 3단계: 결제 처리
  const handlePayment = async () => {
    // 결제 정보 검증
    if (useExistingCard) {
      if (!selectedCardId) {
        alert('카드를 선택해주세요.');
        return;
      }
      if (!cvv.trim() || cvv.length !== 3) {
        alert('CVV 3자리를 입력해주세요.');
        return;
      }
      if (!password.trim() || password.length !== 4) {
        alert('비밀번호 4자리를 입력해주세요.');
        return;
      }
    } else {
      if (!cardHolderName.trim()) {
        alert('카드 소유자 이름을 입력해주세요.');
        return;
      }
      if (!cardNumber.trim() || cardNumber.length !== 16) {
        alert('카드 번호 16자리를 입력해주세요.');
        return;
      }
      if (!expiry.trim() || expiry.length !== 5) {
        alert('만료일을 MM/YY 형식으로 입력해주세요.');
        return;
      }
      if (!cvv.trim() || cvv.length !== 3) {
        alert('CVV 3자리를 입력해주세요.');
        return;
      }
      if (!password.trim() || password.length !== 4) {
        alert('비밀번호 4자리를 입력해주세요.');
        return;
      }
    }

    setIsSubmitting(true);

    try {
      // 배송지 정보 가져오기
      const shippingInfo = JSON.parse(
        sessionStorage.getItem('shippingInfo') || '{}',
      );

      // 주문 데이터 구성
      const orders = selectedItems.map((item) => ({
        cartId: item.cartId,
        cartOrderCheck: 'Y',
        categoryId: item.categoryId,
        productId: item.productId,
        productName: item.productName,
        price: item.price,
        quantity: item.quantity,
        optionCheck: item.optionId ? 'Y' : 'N',
        optionId: item.optionId,
        optionName: item.optionName,
        optionPrice: item.optionPrice || 0,
        totalPrice: (item.price + (item.optionPrice || 0)) * item.quantity,
        phone: phoneNumber,
        recipientName: recipientName,
        deliveryType: deliveryMethod,
        deliveryAddress: `${shippingInfo.postalCode} ${shippingInfo.baseAddress} ${shippingInfo.detailAddress}`,
        deliveryFee: deliveryFee,
      }));

      // 카드 정보
      let paymentInfo;
      if (useExistingCard && selectedCardId) {
        const selectedCard = existingCards.find(
          (card) => card.id === selectedCardId,
        );
        paymentInfo = {
          phone: phoneNumber,
          recipientName: recipientName,
          deliveryType: deliveryMethod,
          cardHolderName: selectedCard!.cardHolderName,
          cardNumber: selectedCard!.cardNumber,
          expiry: selectedCard!.expiry,
          cvv: cvv,
          password: password,
        };
      } else {
        paymentInfo = {
          phone: phoneNumber,
          recipientName: recipientName,
          deliveryType: deliveryMethod,
          cardHolderName,
          cardNumber,
          expiry: expiry,
          cvv: cvv,
          password: password,
        };

        // 새 카드 정보 저장 (옵션)
        const newCard = {
          id: Date.now(),
          cardHolderName,
          cardNumber,
          expiry,
          maskedNumber: `****-****-****-${cardNumber.slice(-4)}`,
        };
        const updatedCards = [...existingCards, newCard];
        localStorage.setItem('savedCards', JSON.stringify(updatedCards));
      }

      // 최종 요청 데이터
      const requestData = {
        orders,
        ...paymentInfo,
      };

      // API 호출
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_URL}/api/v1/order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token || '',
        },
        mode: 'cors',
        credentials: 'include',
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error('결제 처리 중 오류가 발생했습니다.');
      }

      await response.json();

      // 성공 처리
      alert('결제가 완료되었습니다!');

      // 세션 스토리지 정리
      sessionStorage.removeItem('selectedCartItems');
      sessionStorage.removeItem('shippingInfo');
      sessionStorage.removeItem('deliveryMethod');
      sessionStorage.removeItem('orderData');

      // 주문 내역으로 이동
      router.push('/orderHistory');
    } catch (error) {
      console.error('결제 오류:', error);
      alert('결제 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
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
          {/* 왼쪽: 단계별 컨텐츠 (슬라이드 애니메이션) */}
          <section className="flex-1 overflow-hidden">
            <div className="relative">
              {/* 슬라이드 컨테이너 */}
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{
                  transform: `translateX(-${(currentStep - 1) * 100}%)`,
                }}
              >
                {/* 1단계: 배송지 정보 */}
                <div className="w-full shrink-0">
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
                        <label className="block text-sm font-medium mb-2">
                          주소
                        </label>
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
                          id="detailAddress"
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
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg"
                      >
                        다음 단계로
                      </button>
                    </div>
                  </div>
                </div>

                {/* 2단계: 배송 방법 선택 */}
                <div className="w-full shrink-0 pl-4 sm:pl-6">
                  <div className="border border-blue-500 rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-6">
                      <div className="w-2 h-2 rounded-full bg-red-500"></div>
                      <h2 className="text-xl font-bold">배송 방법 선택</h2>
                    </div>

                    <div className="space-y-6">
                      {/* 배송 방법 선택 */}
                      <div className="space-y-4">
                        {/* 당일 배송 */}
                        <label className="block">
                          <div
                            className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                              deliveryMethod === 'same-day'
                                ? 'border-blue-600 bg-blue-50'
                                : 'border-gray-300 hover:border-blue-300'
                            }`}
                            onClick={() => setDeliveryMethod('same-day')}
                          >
                            <div className="flex items-start gap-3">
                              <input
                                type="radio"
                                name="deliveryMethod"
                                value="same-day"
                                checked={deliveryMethod === 'same-day'}
                                onChange={(e) =>
                                  setDeliveryMethod(
                                    e.target.value as DeliveryMethod,
                                  )
                                }
                                className="mt-1"
                              />
                              <div className="flex-1">
                                <div className="font-bold text-lg mb-1">
                                  당일 배송
                                </div>
                                <div className="text-sm text-gray-600 mb-2">
                                  오늘 주문하면 오늘 도착!
                                </div>
                                <div className="text-blue-600 font-medium">
                                  + 5,000원
                                </div>
                              </div>
                            </div>
                          </div>
                        </label>

                        {/* 일반 배송 */}
                        <label className="block">
                          <div
                            className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                              deliveryMethod === 'standard'
                                ? 'border-blue-600 bg-blue-50'
                                : 'border-gray-300 hover:border-blue-300'
                            }`}
                            onClick={() => setDeliveryMethod('standard')}
                          >
                            <div className="flex items-start gap-3">
                              <input
                                type="radio"
                                name="deliveryMethod"
                                value="standard"
                                checked={deliveryMethod === 'standard'}
                                onChange={(e) =>
                                  setDeliveryMethod(
                                    e.target.value as DeliveryMethod,
                                  )
                                }
                                className="mt-1"
                              />
                              <div className="flex-1">
                                <div className="font-bold text-lg mb-1">
                                  일반 배송
                                </div>
                                <div className="text-sm text-gray-600 mb-2">
                                  2-3일 내 배송
                                </div>
                                <div className="text-gray-600 font-medium">
                                  무료
                                </div>
                              </div>
                            </div>
                          </div>
                        </label>
                      </div>

                      {/* 버튼 그룹 */}
                      <div className="flex gap-3">
                        <button
                          onClick={handlePrevStep}
                          className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-lg border border-gray-300"
                        >
                          이전 단계
                        </button>
                        <button
                          onClick={handleDeliveryMethodNext}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg"
                        >
                          다음 단계로
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3단계: 결제 정보 입력 */}
                <div className="w-full shrink-0 pl-4 sm:pl-6">
                  <div className="border border-blue-500 rounded-lg p-6">
                    <div className="flex items-center gap-2 mb-6">
                      <div className="w-2 h-2 rounded-full bg-red-500"></div>
                      <h2 className="text-xl font-bold">결제 정보</h2>
                    </div>

                    <div className="space-y-6">
                      {/* 기존 카드 사용 여부 */}
                      {existingCards.length > 0 && (
                        <div className="space-y-3">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={useExistingCard}
                              onChange={(e) => {
                                setUseExistingCard(e.target.checked);
                                if (e.target.checked) {
                                  // 새 카드 입력 필드 초기화
                                  setCardHolderName('');
                                  setCardNumber('');
                                  setExpiry('');
                                  setCvv('');
                                  setPassword('');
                                }
                              }}
                              className="w-4 h-4"
                            />
                            <span className="font-medium">
                              등록된 카드 사용하기
                            </span>
                          </label>

                          {/* 등록된 카드 목록 */}
                          {useExistingCard && (
                            <div className="space-y-2">
                              {existingCards.map((card) => (
                                <label
                                  key={card.id}
                                  className="block cursor-pointer"
                                >
                                  <div
                                    className={`border-2 rounded-lg p-4 transition-all ${
                                      selectedCardId === card.id
                                        ? 'border-blue-600 bg-blue-50'
                                        : 'border-gray-300 hover:border-blue-300'
                                    }`}
                                    onClick={() => setSelectedCardId(card.id)}
                                  >
                                    <div className="flex items-center gap-3">
                                      <input
                                        type="radio"
                                        name="existingCard"
                                        value={card.id}
                                        checked={selectedCardId === card.id}
                                        onChange={() =>
                                          setSelectedCardId(card.id)
                                        }
                                      />
                                      <div className="flex-1">
                                        <div className="font-medium">
                                          {card.cardHolderName}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                          {card.maskedNumber}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                          만료일: {card.expiry}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </label>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* 새 카드 등록 폼 */}
                      {!useExistingCard && (
                        <div className="space-y-4">
                          {/* 카드 소유자 이름 */}
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              카드 소유자 이름
                            </label>
                            <input
                              type="text"
                              value={cardHolderName}
                              onChange={(e) =>
                                setCardHolderName(e.target.value)
                              }
                              placeholder="홍길동"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>

                          {/* 카드 번호 */}
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              카드 번호
                            </label>
                            <input
                              type="text"
                              value={cardNumber}
                              onChange={(e) => formatCardNumber(e.target.value)}
                              placeholder="1234567812345678"
                              maxLength={16}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                              16자리 숫자 입력
                            </p>
                          </div>

                          {/* 만료일과 CVV */}
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium mb-2">
                                만료일
                              </label>
                              <input
                                type="text"
                                value={expiry}
                                onChange={(e) => formatExpiry(e.target.value)}
                                placeholder="MM/YY"
                                maxLength={5}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium mb-2">
                                CVV
                              </label>
                              <input
                                type="text"
                                value={cvv}
                                onChange={(e) => formatCVV(e.target.value)}
                                placeholder="123"
                                maxLength={3}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* CVV와 비밀번호 (기존 카드 사용 시) */}
                      {useExistingCard && selectedCardId && (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              CVV
                            </label>
                            <input
                              type="text"
                              value={cvv}
                              onChange={(e) => formatCVV(e.target.value)}
                              placeholder="123"
                              maxLength={3}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              비밀번호
                            </label>
                            <input
                              type="password"
                              value={password}
                              onChange={(e) => formatPassword(e.target.value)}
                              placeholder="****"
                              maxLength={4}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                      )}

                      {/* 비밀번호 (새 카드) */}
                      {!useExistingCard && (
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            카드 비밀번호 (앞 4자리)
                          </label>
                          <input
                            type="password"
                            value={password}
                            onChange={(e) => formatPassword(e.target.value)}
                            placeholder="****"
                            maxLength={4}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      )}

                      {/* 버튼 그룹 */}
                      <div className="flex gap-3">
                        <button
                          onClick={handlePrevStep}
                          disabled={isSubmitting}
                          className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          이전 단계
                        </button>
                        <button
                          onClick={handlePayment}
                          disabled={isSubmitting}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSubmitting ? '처리 중...' : '결제하기'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 오른쪽: 주문 요약 */}
          <section className="w-full lg:w-96 shrink-0">
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
              <div className="flex justify-between text-sm mb-3">
                <span className="text-gray-700">배송료</span>
                <span className="font-medium">
                  {shippingFee === 0
                    ? '무료'
                    : `${shippingFee.toLocaleString()}원`}
                </span>
              </div>

              {/* 배송 방법 추가 비용 */}
              {deliveryFee > 0 && (
                <div className="flex justify-between text-sm mb-6">
                  <span className="text-gray-700">당일 배송 추가 비용</span>
                  <span className="font-medium text-blue-600">
                    + {deliveryFee.toLocaleString()}원
                  </span>
                </div>
              )}

              {deliveryFee === 0 && <div className="mb-6"></div>}

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
    </div>
  );
}
