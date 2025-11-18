import type { order } from '@basic-project/shared-types';
import OrderItem from './OrderItem';

// orderNumber로 그룹화된 주문 데이터 타입
interface GroupedOrder {
  orderNumber: string;
  orders: order.OrderInfoResponse[];
  totalAmount: number;
  deliveryFee: number;
  createdAt: Date;
}

interface GroupOrderItemProps {
  group: GroupedOrder;
  groupIndex: number;
  handlePurchaseConfirm: (orderId: number) => void;
}

export default function GroupOrderItem({
  group,
  groupIndex,
  handlePurchaseConfirm,
}: GroupOrderItemProps) {
  return (
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
              주문일시: {new Date(group.createdAt).toLocaleString('ko-KR')}
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
          <OrderItem
            key={orderIndex}
            order={order}
            orderIndex={orderIndex}
            handlePurchaseConfirm={handlePurchaseConfirm}
          />
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
              {(group.totalAmount + group.deliveryFee).toLocaleString()}원
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
