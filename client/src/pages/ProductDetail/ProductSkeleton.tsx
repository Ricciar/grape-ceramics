import React from 'react';

const ProductSkeleton: React.FC = () => (
  <div className="animate-pulse flex flex-col items-center mx-auto min-w-[319px] max-w-md pl-[1px] pr-[1px] pt-0">
    {/* Huvudbild skeleton */}
    <div className="w-full h-[450px] bg-gray-200" />

    {/* Miniatyrbilder skeleton */}
    <div className="flex mt-1 self-start space-x-1">
      {[1, 2, 3].map((i) => (
        <div key={i} className="w-11 h-11 bg-gray-200" />
      ))}
    </div>

    {/* Produktinfo skeleton */}
    <div className="flex flex-col items-center w-full max-w-[290px] mt-5">
      {/* Titel skeleton */}
      <div className="w-3/4 h-6 bg-gray-200 mb-4" />

      {/* Beskrivning skeleton */}
      <div className="w-full h-20 bg-gray-200" />

      {/* Pris och lager skeleton */}
      <div className="w-full h-[65px] flex justify-between mt-4">
        <div className="w-1/3 h-4 bg-gray-200" />
        <div className="w-1/4 h-4 bg-gray-200" />
      </div>

      {/* Knapp skeleton */}
      <div className="w-[292px] h-[55px] bg-gray-200 mt-4 mb-5" />
    </div>
  </div>
);

export default ProductSkeleton;
