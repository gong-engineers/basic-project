declare module 'react-image-gallery' {
  import { ComponentType } from 'react';

  interface ImageGalleryItem {
    original: string;
    thumbnail?: string;
    description?: string;
    originalAlt?: string;
    thumbnailAlt?: string;
    originalClass?: string;
    thumbnailClass?: string;
    sizes?: string;
    srcSet?: string;
    renderItem?: () => JSX.Element;
    renderThumbInner?: () => JSX.Element;
  }

  interface ImageGalleryProps {
    items: ImageGalleryItem[];
    showThumbnails?: boolean;
    showFullscreenButton?: boolean;
    showPlayButton?: boolean;
    autoPlay?: boolean;
    slideInterval?: number;
    showNav?: boolean;
    lazyLoad?: boolean;
  }

  const ImageGallery: ComponentType<ImageGalleryProps>;

  export default ImageGallery;
}
