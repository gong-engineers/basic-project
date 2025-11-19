'use client';

import { isEmpty } from 'lodash-es';
import CustomGallery from './CustomGallery';

interface Props {
  images: string[] | null;
}

function ImageSection(props: Props) {
  const { images } = props;

  return (
    <div className="w-1/2 max-w-xl flex flex-col gap-4">
      {images && !isEmpty(images) ? (
        <CustomGallery images={images!} />
      ) : (
        <div className="relative flex items-center justify-center bg-gray-100 aspect-4/3 rounded-lg">
          <span className="text-4xl">📦</span>
        </div>
      )}
    </div>
  );
}

export default ImageSection;
