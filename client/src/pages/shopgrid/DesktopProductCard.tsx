import React, { useState } from 'react';
import { DesktopProductCardProps } from './types';
import { capitalizeFirstLetter } from './ProductLayoutUtils';

const DesktopProductCard: React.FC<DesktopProductCardProps> = ({ product, onClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!product.images || product.images.length === 0) {
    return null;
  }

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation(); // förhindra att onClick triggas
    setCurrentIndex((prev) => (prev + 1) % product.images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  
  // 🔥 Pris-funktion för säker formatering (utan decimaler)
  const formatPrice = (price: string | null): string => {
    if (!price) return "0";
    const num = Number(price);
    if (isNaN(num)) return price; // redan text
    return Math.round(num).toString(); // heltal utan decimaler
  };


  return (
    <div
      className="cursor-pointer group relative"
      onClick={() => onClick(product.id)}
    >
      {/* Produktbild */}
      <div className="w-full h-[450px] bg-gray-100 overflow-hidden relative">
        <img
          src={product.images[currentIndex].src}
          alt={product.images[currentIndex].alt || product.name}
          loading="lazy"
          className="w-full h-full object-cover"
        />

        {/* Visa pilar bara om det finns fler än 1 bild */}
        {product.images.length > 1 && (
          <>
            {/* Vänsterpil */}
            <button
              onClick={prevImage}
              className="absolute top-1/2 left-2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
            >
              ◀
            </button>

            {/* Högerpil */}
            <button
              onClick={nextImage}
              className="absolute top-1/2 right-2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition"
            >
              ▶
            </button>
          </>
        )}
      </div>

      {/* Produktnamn och pris */}
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
