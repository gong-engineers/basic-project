'use client';

import { isEmpty } from 'lodash-es';
import Image from 'next/image';

interface Props {
  images: string[] | null;
}

function ImageSection(props: Props) {
  const { images } = props;

  return (
    <div className="w-1/2 max-w-xl flex flex-col gap-4">
      <div className="relative flex items-center justify-center bg-gray-100 aspect-4/3 rounded-lg overflow-hidden">
        {images && !isEmpty(images) ? (
          <Image
            src={images[0]}
            alt="대표이미지"
            width={800}
            height={600}
            priority
            className="object-contain object-center"
          />
        ) : (
          <span className="text-4xl">📦</span>
        )}
      </div>
      {images && images.length > 1 && <div>todo: 썸네일 추가</div>}
    </div>
  );
}

export default ImageSection;
