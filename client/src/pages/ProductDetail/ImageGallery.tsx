import { ImageGalleryProps } from './types';

// Bildgalleri-komponent
const ImageGallery = ({
  images,
  currentIndex,
  onImageClick,
}: ImageGalleryProps) => (
  <div className="flex mt-1 self-start space-x-1 overflow-x-auto">
    {images.map((image, index) => (
      <div
        key={index}
        className="relative min-w-[44px] h-11 md:w-[90px] md:h-[90px] cursor-pointer"
        onClick={() => onImageClick(index)}
      >
        <img
          src={image}
          alt={`Miniatyrbild ${index + 1}`}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {currentIndex === index && (
          <div className="absolute inset-0 bg-white opacity-50" />
        )}
      </div>
    ))}
  </div>
);

export default ImageGallery;
