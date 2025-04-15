import React from 'react';

const SkeletonProductCard: React.FC = () => {
  return (
    <div className="cursor-default" role="status">
      {/* Produktbild skeleton */}
      <div className="w-full h-[450px] bg-gray-200 overflow-hidden animate-pulse" />

      {/* Produktnamn skeleton */}
      <div className="mt-2 ml-3 flex flex-col justify-between">
        <div className="h-4 w-32 bg-gray-200  animate-pulse" />

        {/* Pris skeleton */}
        <div className="flex text-right font-light mr-2 mt-2 mb-2">
          <div className="h-4 w-20 bg-gray-200 animate-pulse" />
        </div>
      </div>
      <span className="sr-only">Laddar produkter...</span>
    </div>
  );
};

export default SkeletonProductCard;
