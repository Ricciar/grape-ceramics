import React, { useState } from 'react';
import {
  getProductLayoutClasses,
  getImageHeightClasses,
  capitalizeFirstLetter,
} from './ProductLayoutUtils';
import { ProductCardProps } from './types';

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  index,
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const mainImage = product.images[0]?.src;
  const hoverImage = product.images[1]?.src;

  // Säkerställ att priser alltid visas korrekt
  const formatPrice = (price: string | null): string => {
    if (!price) return "0";
    const num = Number(price);
    if (isNaN(num)) return price; // om det redan är text
    return num.toFixed(2); // visa med 2 decimaler
  };

  return (
    <div
      className={getProductLayoutClasses(index)}
      onClick={() => onClick(product.id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Produktbild */}
      <div
        className={`w-full ${getImageHeightClasses(
          index
        )} bg-gray-100 overflow-hidden relative`}
      >
        <img
          src={isHovered && hoverImage ? hoverImage : mainImage}
          alt={product.images[0]?.alt || product.name}
          loading="lazy"
          className="w-full h-full object-cover transition duration-300"
        />

        {/* Pil-overlay – visas bara vid hover om det finns fler bilder */}
        {isHovered && hoverImage && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
            <span className="text-white text-3xl">➜</span>
          </div>
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
