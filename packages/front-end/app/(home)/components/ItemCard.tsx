import { formatDatePeriod } from '@/utils/date.util';
import { convertCategory } from '@/utils/item.util';
import { Item } from '@basic-project/shared-types';
import { isEmpty } from 'lodash-es';

import Image from 'next/image';

interface Props {
  item: Item.Product;
}

function ItemCard(props: Props) {
  const {
    name,
    price,
    images,
    description,
    discountPrice,
    discountStartDate,
    discountEndDate,
    category,
  } = props.item;

  const {
    label: categoryLabel,
    bgColor: categoryBgColor,
    textColor: categoryTextColor,
  } = convertCategory(category);
  const formattedDiscountPeriod = formatDatePeriod(
    discountStartDate,
    discountEndDate,
  );

  return (
    // TODO: 링크 컴포넌트 추가해서 상세 페이지로 이동할 수 있도록 수정 필요
    <div className="outline outline-gray-200 w-70 p-3 rounded-lg">
      {/* 이미지 */}
      <div className="relative flex items-center justify-center bg-gray-100 w-64 h-30 rounded-lg overflow-hidden">
        {images && !isEmpty(images) ? (
          <Image
            src={images[0]}
            alt="상품이미지"
            width={512}
            height={240}
            priority
            className="object-contain object-center"
          />
        ) : (
          <span className="text-3xl">📦</span>
        )}
        {/* 카테고리 뱃지 */}
        <div
          className={`${categoryBgColor} ${categoryTextColor} absolute top-2 right-2 px-2 py-1 rounded-md text-xs font-semibold`}
        >
          {categoryLabel}
        </div>
      </div>

      <div className="mt-2">
        <h3 className="font-bold text-sm">{name}</h3>
        <p className="text-gray-500 text-sm">{description}</p>
        {/* 가격 및 할인 정보 */}
        <div className="flex items-center justify-between mt-3">
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
                <div className="text-xs text-gray-500">
                  {formattedDiscountPeriod}
                </div>
              )}
            </div>
          ) : (
            <span className="text-base font-bold">
              {price.toLocaleString()}원
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default ItemCard;
