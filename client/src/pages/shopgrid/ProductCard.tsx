import React, { useState, useRef, useCallback } from 'react';
import { ProductCardProps } from './types';

const SWIPE_THRESHOLD = 50; // px

const Chevron = ({ dir = 'left' }: { dir?: 'left' | 'right' }) => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d={dir === 'left' ? 'M15 4 L9 12 L15 20' : 'M9 4 L15 12 L9 20'}
      stroke="white"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Hjälp: responsive sizes för 2-kol mobil och 3-kol desktop, max container ~ 1152px (6xl)
const IMG_SIZES =
  '(min-width:1024px) calc((min(1152px, 100vw) - 2px) / 3), ' + // desktop: 3 kol
  'calc((100vw - 2px) / 2)';                                     // mobil: 2 kol

// Antagen renderbredd/höjd (för att undvika CLS), matchar 4:5-aspekt
const PLACEHOLDER_WIDTH_DESKTOP = 384;  // ~ 1152px / 3
const PLACEHOLDER_WIDTH_MOBILE  = 360;  // typisk mobilbredd/2
const WIDTH_ATTR =  // använd ett rimligt snitt; påverkar inte layouten visuellt
  typeof window !== 'undefined' && window.innerWidth >= 1024
    ? PLACEHOLDER_WIDTH_DESKTOP
    : PLACEHOLDER_WIDTH_MOBILE;
const HEIGHT_ATTR = Math.round(WIDTH_ATTR * 5 / 4);

const ProductCard: React.FC<ProductCardProps> = ({ product, index, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const images = product.images || [];
  const mainImage = images[currentImageIndex]?.src;

  const formatPrice = (price: string | null): string => {
    if (!price) return '0';
    const num = Number(price);
    if (isNaN(num)) return price;
    return Math.round(num).toString();
  };

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!images.length || touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    if (deltaX > SWIPE_THRESHOLD) {
      setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    } else if (deltaX < -SWIPE_THRESHOLD) {
      setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }
    touchStartX.current = null;
  }, [images.length]);

  const nextImage = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (!images.length) return;
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  const prevImage = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (!images.length) return;
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const mobileLayout = index % 5 === 4 ? 'col-span-2' : 'col-span-1';

  // Första ~12 korten prioriteras, resten lågt
  const fetchPriority = index < 12 ? 'high' as const : 'low' as const;

  return (
    <div
      className={`cursor-pointer ${mobileLayout} group`}
      onClick={() => onClick(product.id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Bild */}
      <div
        className="w-full aspect-[4/5] bg-gray-100 overflow-hidden relative"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {mainImage && (
          <img
            src={mainImage}
            alt={product.images?.[0]?.alt || product.name}
            loading="lazy"
            decoding="async"
            fetchPriority={fetchPriority}
            sizes={IMG_SIZES}
            width={WIDTH_ATTR}
            height={HEIGHT_ATTR}
            className="w-full h-full object-cover transition duration-300"
          />
        )}

        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className={`hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/30 hover:bg-black/40 rounded-full transition ${
                isHovered ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              }`}
              aria-label="Föregående bild"
            >
              <Chevron dir="left" />
            </button>

            <button
              onClick={nextImage}
              className={`hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/30 hover:bg-black/40 rounded-full transition ${
                isHovered ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              }`}
              aria-label="Nästa bild"
            >
              <Chevron dir="right" />
            </button>
          </>
        )}
      </div>

      {/* Meta */}
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
              <span className="text-xs ml-2">{formatPrice(product.price)} SEK</span>
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

export default React.memo(ProductCard);
