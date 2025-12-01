'use client';

import type { common, order } from '@basic-project/shared-types';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { client } from '../../../lib/api';
import GroupOrderItem from './components/GroupOrderItem';

// orderNumber로 그룹화된 주문 데이터 타입
interface GroupedOrder {
  orderNumber: string;
  orders: order.OrderInfoResponse[];
  totalAmount: number;
  deliveryFee: number;
  createdAt: Date;
}

import { API_URL } from '@/lib/api/utils';

export default function OrderHistory() {
  const [orderList, setOrderList] = useState<order.OrderInfoResponse[]>([]);
  const [groupedOrders, setGroupedOrders] = useState<GroupedOrder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const hasFetched = useRef(false); // API 호출 여부를 추적 (React Strict Mode 대응)

  useEffect(() => {
    // 이미 한 번 실행되었으면 중복 호출 방지
    // React Strict Mode에서는 useEffect가 두 번 실행되는데, state로는 이를 막을 수 없고 State는 재마운트 시 초기화되기 때문
    // 때문에 useRef를 사용하여 중복 방지
    if (hasFetched.current) return;
    hasFetched.current = true;

    const isCancelled = false; // cleanup을 위한 플래그

    (async () => {
      setIsLoading(true);
      try {
        // 주문 이력 조회
        const orderListResponse = await client.get<
          null,
          common.ResponseDto<order.OrderInfoResponse[]>
        >(`${API_URL}/api/v1/order`, null, {
          mode: 'cors',
          credentials: 'include',
        });

        // 컴포넌트가 unmount되었으면 state 업데이트 하지 않음
        if (isCancelled) return;

        setOrderList(orderListResponse.data);

        // orderNumber로 그룹화
        const grouped = groupByOrderNumber(orderListResponse.data);
        setGroupedOrders(grouped);
      } catch (err) {
        if (!isCancelled) {
          console.error('주문 이력 조회 실패:', err);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
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
    // 이미 확정된 주문인지 확인 (중복 클릭 방지)
    const targetOrder = orderList.find((item) => item.orderId === orderId);
    if (!targetOrder || targetOrder.purchaseConfirm === 'Y') {
      return;
    }

    // 낙관적 업데이트 (UI 먼저 업데이트)
    setOrderList((prevList) =>
      prevList.map((item) =>
        item.orderId === orderId ? { ...item, purchaseConfirm: 'Y' } : item,
      ),
    );

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

    try {
      await client.patch<
        order.PurchaseConfirmRequest,
        common.ResponseDto<null>
      >(
        `${API_URL}/api/v1/order/purchase-confirm`,
        {
          orderId: orderId,
          purchaseConfirm: 'Y',
        },
        {
          mode: 'cors',
          credentials: 'include',
        },
      );

      alert('주문이 확정되었습니다.');
    } catch (err) {
      console.error('주문 확정 실패:', err);
      alert('주문 확정에 실패했습니다.');

      // 실패 시 롤백
      setOrderList((prevList) =>
        prevList.map((item) =>
          item.orderId === orderId ? { ...item, purchaseConfirm: 'N' } : item,
        ),
      );

      setGroupedOrders((prevGroups) =>
        prevGroups.map((group) => ({
          ...group,
          orders: group.orders.map((order) =>
            order.orderId === orderId
              ? { ...order, purchaseConfirm: 'N' }
              : order,
          ),
        })),
      );
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
            groupedOrders.map((group, groupIndex) => {
              return (
                <GroupOrderItem
                  key={groupIndex}
                  group={group}
                  groupIndex={groupIndex}
                  handlePurchaseConfirm={handlePurchaseConfirm}
                />
              );
            })
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p className="text-lg">주문 이력이 없습니다.</p>
              <button
                onClick={() => router.push('/')}
                className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
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
