import type { order } from '@basic-project/shared-types';

interface OrderItemProps {
  order: order.OrderInfoResponse;
  orderIndex: number;
  handlePurchaseConfirm: (orderId: number) => void;
}

export default function OrderItem({
  order,
  orderIndex,
  handlePurchaseConfirm,
}: OrderItemProps) {
  return (
    <div
      key={orderIndex}
      className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-3 bg-gray-50 rounded-lg"
    >
      {/* 상품 정보 */}
      <div className="flex-1">
        <h4 className="font-semibold text-gray-800">{order.productName}</h4>
        {order.optionCheck === 'Y' && order.optionName && (
          <p className="text-sm text-gray-600">
            옵션: {order.optionName} (+
            {order.optionPrice?.toLocaleString()}원)
          </p>
        )}
        <p className="text-sm text-gray-600">
          수량: {order.quantity}개 | 금액: {order.price.toLocaleString()}원
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
        {order.purchaseConfirm === 'Y' ? '확정 완료' : '주문 확정'}
      </button>
    </div>
  );
}
