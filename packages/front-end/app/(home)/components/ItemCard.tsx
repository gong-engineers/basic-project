import { formatDatePeriod } from '@/utils/date.util';
import { convertCategory } from '@/utils/item.util';
import { item } from '@basic-project/shared-types';
import { isEmpty } from 'lodash-es';

import Image from 'next/image';
import Link from 'next/link';

interface Props {
  item: item.Product;
}

function ItemCard(props: Props) {
  const {
    id,
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
    <Link href={`/products/${id}`}>
      <div className="outline outline-gray-200 p-3 rounded-lg flex flex-col w-full h-full">
        {/* 이미지 */}
        <div className="relative flex items-center justify-center bg-gray-100 w-full aspect-5/3 rounded-lg overflow-hidden">
          {images && !isEmpty(images) ? (
            <Image
              src={images[0]}
              alt="상품이미지"
              width={500}
              height={300}
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

        <div className="mt-2 flex flex-col flex-1">
          <h3 className="font-bold text-sm">{name}</h3>
          <p className="text-gray-500 text-sm flex-1">{description}</p>
          {/* 가격 및 할인 정보 */}
          <div className="flex items-center justify-between mt-3 h-10">
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
                  <div className="text-xs text-gray-500 mt-0.5">
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
        </div>
      </div>
    </Link>
  );
}

export default ItemCard;
