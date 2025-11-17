'use client';

import { formatDatePeriod } from '@/utils/date.util';
import { convertCategory } from '@/utils/item.util';
import { item } from '@basic-project/shared-types';
import { useState } from 'react';
import QuantitySelector from './QuantitySelector';

interface Props {
  product: item.Product;
}

function DescriptionSection(props: Props) {
  const {
    name,
    price,
    description,
    discountPrice,
    discountStartDate,
    discountEndDate,
    category,
  } = props.product;

  const [quantity, setQuantity] = useState(1);

  const {
    label: categoryLabel,
    bgColor: categoryBgColor,
    textColor: categoryTextColor,
  } = convertCategory(category);
  const formattedDiscountPeriod = formatDatePeriod(
    discountStartDate,
    discountEndDate,
  );

  const handleQuantityChange = (value: number) => {
    setQuantity(value);
  };

  return (
    <div className="flex flex-col divide-gray-300 gap-4 w-1/2">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <div
            className={`${categoryBgColor} ${categoryTextColor} px-2 py-1 rounded-md text-xs font-semibold w-fit`}
          >
            {categoryLabel}
          </div>
          <div className="text-xl font-semibold">{name}</div>
        </div>
        <div className="flex items-center justify-between">
          {discountPrice !== 0 ? (
            <div>
              <div className="flex gap-1 items-center">
                <span className="text-base font-bold">
                  {discountPrice.toLocaleString()}원
                </span>
                <span className="line-through text-gray-500 text-xs">
                  {price.toLocaleString()}원
                </span>
              </div>
              {formattedDiscountPeriod && (
                <div className="text-xs text-gray-500 mt-1">
                  ⏰ 할인 기간: {formattedDiscountPeriod}
                </div>
              )}
            </div>
          ) : (
            <span className="text-base font-bold">
              {price.toLocaleString()}원
            </span>
          )}
        </div>
        <div>
          <div className="font-semibold">수량</div>
          <QuantitySelector value={quantity} onChange={handleQuantityChange} />
        </div>
        <div>
          <div className="font-semibold">상품 상세 설명</div>
          <div className="text-gray-500">{description}</div>
        </div>
      </div>

      <hr />

      <div className="flex flex-col gap-2">
        <button
          onClick={() => console.log('todo: 장바구니 담기')}
          className="w-full bg-blue-600 text-white rounded-sm h-10 font-semibold cursor-pointer"
        >
          🛒 장바구니 담기
        </button>
        <button
          onClick={() => console.log('todo: 바로 구매')}
          className="w-full bg-green-600 text-white rounded-sm h-10 font-semibold cursor-pointer"
        >
          바로 구매
        </button>
      </div>
    </div>
  );
}

export default DescriptionSection;
