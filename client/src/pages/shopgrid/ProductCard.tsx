import React, { useState, useRef } from 'react';
import { ProductCardProps } from './types';

const SWIPE_THRESHOLD = 50; // px

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  index,
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const images = product.images || [];
  const mainImage = images[currentImageIndex]?.src;
  const hoverImage = images[1]?.src;

  const formatPrice = (price: string | null): string => {
    if (!price) return '0';
    const num = Number(price);
    if (isNaN(num)) return price;
    return Math.round(num).toString();
  };

  // 📱 Swipe-start
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  // 📱 Swipe-end
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!images.length || touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    if (deltaX > SWIPE_THRESHOLD) {
      // swipe höger → föregående bild
      setCurrentImageIndex((prev) =>
        prev === 0 ? images.length - 1 : prev - 1
      );
    } else if (deltaX < -SWIPE_THRESHOLD) {
      // swipe vänster → nästa bild
      setCurrentImageIndex((prev) =>
        prev === images.length - 1 ? 0 : prev + 1
      );
    }
    touchStartX.current = null;
  };

  const mobileLayout = index % 5 === 4 ? 'col-span-2' : 'col-span-1';

  return (
    <div
      className={`cursor-pointer ${mobileLayout}`}
      onClick={() => onClick(product.id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Produktbild */}
      <div
        className="w-full aspect-[4/5] bg-gray-100 overflow-hidden relative"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={mainImage}
          alt={product.images[0]?.alt || product.name}
          loading="lazy"
          className="w-full h-full object-cover transition duration-300"
        />

        {/* Pil-overlay – visas bara på desktop vid hover */}
        {isHovered && hoverImage && (
          <div className="hidden md:flex absolute inset-0 items-center justify-center bg-black bg-opacity-30">
            <span className="text-white text-3xl">➜</span>
          </div>
        )}
      </div>

      {/* Produktnamn och pris */}
      <div className="mt-2 ml-3 flex flex-col justify-between">
        <span className="text-xs font-light leading-none tracking-[2.28px] text-[#1C1B1F]">
          {product.name}
        </span>
        <div className="flex text-right font-light mr-2 mt-2 mb-2">
          {product.sale_price ? (
            <>
              <span className="text-xs line-through text-gray-400">
                {formatPrice(product.regular_price)} SEK
              </span>
              <br />
              <span className="text-xs ml-2">
                {formatPrice(product.price)} SEK
              </span>
            </>
          ) : (
            <span className="text-xs font-light leading-none tracking-[2.28px] text-[#1C1B1F]">
              {formatPrice(product.price)} SEK
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
