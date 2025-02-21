import React from 'react';

const ProductSkeleton: React.FC = () => (
  <div className="animate-pulse flex flex-col items-center md:flex-row md:justify-around md:gap-[11rem] mx-auto min-w-[319px] max-w-md md:max-w-[1200px] pl-[1px] pr-[1px] pt-0">
    {/* Vänster sektion med bild och galleri */}
    <div className="w-full md:w-1/2 flex flex-col">
      {/* Huvudbild skeleton - uppdaterad med korrekta dimensioner */}
      <div className="relative w-full md:w-[600px] h-[450px] md:h-[645px] bg-gray-200" />

      {/* Miniatyrbilder skeleton - uppdaterad med korrekt spacing */}
      <div className="flex mt-1 self-start space-x-1">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="min-w-[44px] h-11 md:w-[90px] md:h-[90px] bg-gray-200"
          />
        ))}
      </div>
    </div>

    {/* Höger sektion med produktinfo - uppdaterad med korrekt styling */}
    <div className="flex flex-col items-center w-full md:w-1/2 md:items-start max-w-[290px] md:max-w-none font-light tracking-[2.85px]">
      {/* Titel skeleton */}
      <div className="w-3/4 h-6 bg-gray-200 mt-5" />

      {/* Beskrivning skeleton */}
      <div className="w-full h-20 bg-gray-200 mt-[5px]" />

      {/* Pris och lager skeleton */}
      <div className="w-full h-[65px] flex justify-between mt-4 mb-2">
        <div className="w-1/3 h-4 bg-gray-200" />
        <div className="w-1/4 h-4 bg-gray-200" />
      </div>

      {/* Knapp skeleton */}
      <div className="w-[292px] h-[55px] bg-gray-200 mb-5" />
    </div>
  </div>
);

export default ProductSkeleton;
