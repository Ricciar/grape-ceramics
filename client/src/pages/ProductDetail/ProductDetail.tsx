import React from 'react';

const ProductSkeleton: React.FC = () => (
  <div className="flex flex-col items-center lg:flex-row lg:justify-around lg:gap-[11rem]">
    {/* Vänster sektion med bild och galleri */}
    <div className="w-full lg:w-1/2 flex flex-col">
      {/* Huvudbild skeleton */}
      <div className="relative w-full lg:w-[600px] h-[450px] lg:h-[645px] bg-gray-200" />

      {/* Miniatyrbilder skeleton */}
      <div className="flex mt-2 space-x-2 overflow-x-auto">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="min-w-[75px] w-[75px] h-[75px] lg:w-[90px] lg:h-[90px] bg-gray-200 flex-shrink-0"
          />
        ))}
      </div>
    </div>

    {/* Höger sektion med produktinfo */}
    <div className="flex flex-col items-center w-full lg:w-1/2 lg:items-start max-w-[290px] lg:max-w-none font-light tracking-[2.85px]">
      {/* Titel skeleton */}
      <div className="w-3/4 h-6 bg-gray-200 mt-5 self-center lg:self-start" />

      {/* Beskrivning skeleton */}
      <div className="w-full h-28 bg-gray-200 mt-[5px]" />

      {/* Pris och lager skeleton */}
      <div className="w-full h-[65px] flex justify-between mt-4 mb-2">
        <div className="flex items-center">
          <div className="w-24 h-4 bg-gray-200" />
        </div>
        <div className="text-right">
          <div className="w-16 h-4 bg-gray-200 ml-auto" />
        </div>
      </div>

      {/* Knapp skeleton */}
      <div className="w-[292px] h-[55px] bg-gray-200 mb-5" />
    </div>
  </div>
);

export default ProductSkeleton;
