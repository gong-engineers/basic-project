import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';
import './gallery.css';

interface Props {
  images: string[];
}

function CustomGallery(props: Props) {
  const { images } = props;

  const galleryItems = images.map((img) => ({
    original: img,
    thumbnail: img,
  }));

  return (
    <div className="aspect-4/3 rounded-xl">
      <ImageGallery
        items={galleryItems}
        showPlayButton={false}
        showFullscreenButton={false}
        showNav={false}
        lazyLoad={true}
      />
    </div>
  );
}

export default CustomGallery;
