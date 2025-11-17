'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { client } from '../../lib/api';
import type { order, common } from '@basic-project/shared-types';

// orderNumber로 그룹화된 주문 데이터 타입
interface GroupedOrder {
  orderNumber: string;
  orders: order.OrderInfoResponse[];
  totalAmount: number;
  deliveryFee: number;
  createdAt: Date;
}

export default function OrderHistory() {
  const [orderList, setOrderList] = useState<order.OrderInfoResponse[]>([]);
  const [groupedOrders, setGroupedOrders] = useState<GroupedOrder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        // 주문 이력 조회
        const orderListResponse = await client.get<
          null,
          common.ResponseDto<order.OrderInfoResponse[]>
        >('http://localhost:3001/api/v1/order', null, {
          headers: {
            Authorization: localStorage.getItem('accessToken') || '',
          },
          mode: 'cors',
          credentials: 'include',
        });

        setOrderList(orderListResponse.data);

        // orderNumber로 그룹화
        const grouped = groupByOrderNumber(orderListResponse.data);
        setGroupedOrders(grouped);
      } catch (err) {
        console.error('주문 이력 조회 실패:', err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // orderNumber로 그룹화하는 함수
  const groupByOrderNumber = (
    orders: order.OrderInfoResponse[],
  ): GroupedOrder[] => {
    const grouped = orders.reduce(
      (acc, order) => {
        const key = order.orderNumber;
        if (!acc[key]) {
          acc[key] = [];
        }
        acc[key].push(order);
        return acc;
      },
      {} as Record<string, order.OrderInfoResponse[]>,
    );

    return Object.entries(grouped).map(([orderNumber, orders]) => {
      const totalAmount = orders.reduce(
        (sum, order) => sum + order.totalPrice,
        0,
      );
      const deliveryFee = orders[0].deliveryFee || 0;

      return {
        orderNumber,
        orders,
        totalAmount,
        deliveryFee,
        createdAt: orders[0].createdAt,
      };
    });
  };

  // 주문 확정 버튼 핸들러
  const handlePurchaseConfirm = async (orderId: number) => {
    try {
      await client.patch<
        order.PurchaseConfirmRequest,
        common.ResponseDto<null>
      >(
        'http://localhost:3001/api/v1/order/purchase-confirm',
        {
          orderId: orderId,
          purchaseConfirm: 'Y',
        },
        {
          headers: {
            Authorization: localStorage.getItem('accessToken') || '',
          },
          mode: 'cors',
          credentials: 'include',
        },
      );

      // 주문 이력 리스트 업데이트
      setOrderList((prevList) =>
        prevList.map((item) =>
          item.orderId === orderId ? { ...item, purchaseConfirm: 'Y' } : item,
        ),
      );

      // 그룹화된 주문 리스트도 업데이트
      setGroupedOrders((prevGroups) =>
        prevGroups.map((group) => ({
          ...group,
          orders: group.orders.map((order) =>
            order.orderId === orderId
              ? { ...order, purchaseConfirm: 'Y' }
              : order,
          ),
        })),
      );

      alert('주문이 확정되었습니다.');
    } catch (err) {
      console.error('주문 확정 실패:', err);
      alert('주문 확정에 실패했습니다.');
    }
  };

  return isLoading ? (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  ) : (
    <div className="min-h-screen bg-white py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 주문 이력 상단 영역 */}
        <div className="border border-gray-300 rounded-lg p-4 sm:p-6 mb-4">
          <h2 className="text-xl sm:text-2xl font-bold">주문 이력</h2>
          <p className="text-sm sm:text-base text-gray-600">
            총 {groupedOrders.length}건의 주문
          </p>
        </div>

        {/* 주문 이력 리스트 */}
        <div className="flex flex-col gap-4 sm:gap-6">
          {groupedOrders.length !== 0 ? (
            groupedOrders.map((group, groupIndex) => (
              <div
                key={groupIndex}
                className="border border-gray-300 rounded-lg p-4 sm:p-6"
              >
                {/* 주문 번호 및 날짜 */}
                <div className="mb-4 pb-4 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">
                        주문번호: {group.orderNumber}
                      </h3>
                      <p className="text-sm text-gray-600">
                        주문일시:{' '}
                        {new Date(group.createdAt).toLocaleString('ko-KR')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">배송지</p>
                      <p className="text-sm font-medium">
                        {group.orders[0].deliveryAddress}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 주문 상품 목록 */}
                <div className="space-y-3">
                  {group.orders.map((order, orderIndex) => (
                    <div
                      key={orderIndex}
                      className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      {/* 상품 정보 */}
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">
                          {order.productName}
                        </h4>
                        {order.optionCheck === 'Y' && order.optionName && (
                          <p className="text-sm text-gray-600">
                            옵션: {order.optionName} (+
                            {order.optionPrice?.toLocaleString()}원)
                          </p>
                        )}
                        <p className="text-sm text-gray-600">
                          수량: {order.quantity}개 | 금액:{' '}
                          {order.price.toLocaleString()}원
                        </p>
                        <p className="text-sm font-medium text-gray-800 mt-1">
                          총 금액: {order.totalPrice.toLocaleString()}원
                        </p>
                      </div>

                      {/* 주문 확정 버튼 */}
                      <button
                        onClick={() => handlePurchaseConfirm(order.orderId)}
                        disabled={order.purchaseConfirm === 'Y'}
                        className={`px-4 py-2 rounded-lg font-medium text-white whitespace-nowrap ${
                          order.purchaseConfirm === 'Y'
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-orange-500 hover:bg-orange-600 cursor-pointer'
                        }`}
                      >
                        {order.purchaseConfirm === 'Y'
                          ? '확정 완료'
                          : '주문 확정'}
                      </button>
                    </div>
                  ))}
                </div>

                {/* 주문 요약 정보 */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div className="text-sm text-gray-600">
                      <p>수령인: {group.orders[0].recipientName}</p>
                      <p>연락처: {group.orders[0].phone}</p>
                      <p>배송 방식: {group.orders[0].deliveryType}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">
                        상품 금액: {group.totalAmount.toLocaleString()}원
                      </p>
                      <p className="text-sm text-gray-600">
                        배송비:{' '}
                        {group.deliveryFee === 0
                          ? '무료'
                          : `${group.deliveryFee.toLocaleString()}원`}
                      </p>
                      <p className="text-lg font-bold text-blue-600 mt-1">
                        총 결제 금액:{' '}
                        {(
                          group.totalAmount + group.deliveryFee
                        ).toLocaleString()}
                        원
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">주문 이력이 없습니다.</p>
              <button
                onClick={() => router.push('/')}
                className="mt-4 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
              >
                쇼핑 시작하기
              </button>
            </div>
          )}
        </div>

        {/* 홈으로 돌아가기 버튼 */}
        {groupedOrders.length > 0 && (
          <div className="mt-6 text-center">
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 border border-gray-300 hover:bg-gray-50 font-medium rounded-lg"
            >
              홈으로 돌아가기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
