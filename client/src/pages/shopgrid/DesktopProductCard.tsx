import React, { useState } from 'react';
import { DesktopProductCardProps } from './types';
import { capitalizeFirstLetter } from './ProductLayoutUtils';

// Chevron som matchar bilden du skickade
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

const DesktopProductCard: React.FC<DesktopProductCardProps> = ({ product, onClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!product.images || product.images.length === 0) {
    return null;
  }

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? product.images.length - 1 : prev - 1));
  };

  const formatPrice = (price: string | null): string => {
    if (!price) return '0';
    const num = Number(price);
    if (isNaN(num)) return price;
    return Math.round(num).toString();
  };

  return (
    <div className="cursor-pointer group relative" onClick={() => onClick(product.id)}>
      {/* Bild */}
      <div className="w-full h-[450px] bg-gray-100 overflow-hidden relative">
        <img
          src={product.images[currentIndex].src}
          alt={product.images[currentIndex].alt || product.name}
          loading="lazy"
          className="w-full h-full object-cover"
        />

        {/* Chevronpilar (bara om fler än 1 bild) */}
        {product.images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/30 hover:bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition"
              aria-label="Föregående bild"
            >
              <Chevron dir="left" />
            </button>

            <button
              onClick={nextImage}
              className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/30 hover:bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition"
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
          {capitalizeFirstLetter(product.name)}
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

export default DesktopProductCard;
