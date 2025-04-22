import React from 'react';

// Skeleton for product card
const SkeletonProductCard = ({
  height = 'h-[236px] md:h-[321px]',
}: {
  height?: string;
}) => (
  <div
    className={`relative w-full ${height} overflow-hidden bg-gray-200 animate-pulse`}
  >
    <div className="absolute inset-0 flex items-center justify-center"></div>
  </div>
);

// Skeleton for info section
const SkeletonInfoSection = ({
  height = 'h-[225px] md:h-[456px]',
}: {
  height?: string;
}) => (
  <div
    className={`w-full bg-gray-200 py-8 px-4 animate-pulse flex items-center justify-center ${height}`}
  ></div>
);

// Skeleton for video section
const SkeletonVideoSection = ({
  height = 'h-[400px]',
}: {
  height?: string;
}) => (
  <div
    className={`w-full ${height} bg-gray-200 animate-pulse flex items-center justify-center`}
  ></div>
);

export const SkeletonMainPage: React.FC = () => {
  return (
    <div className="w-full max-w-full overflow-hidden">
      {/* Mobile/Tablet Skeleton Layout */}
      <div className="flex flex-col md:hidden">
        {/* Video Section */}
        <div className="w-full mt-[2px] z-0">
          <SkeletonVideoSection height="h-[236px]" />
        </div>

        {/* First Row of Products */}
        <div className="w-full grid grid-cols-2 p-[2px] gap-[2px] z-10">
          <SkeletonProductCard />
          <SkeletonProductCard />
        </div>

        {/* Info Section */}
        <SkeletonInfoSection />

        {/* Second Row of Products */}
        <div className="w-full grid grid-cols-2 p-[2px] gap-[2px] z-10">
          <SkeletonProductCard />
          <SkeletonProductCard />
        </div>

        {/* Third Row of Products */}
        <div className="w-full grid grid-cols-2 p-[2px] gap-[2px] z-10">
          <SkeletonProductCard />
          <SkeletonProductCard />
        </div>
      </div>

      {/* Desktop Skeleton Layout */}
      <div className="hidden md:flex md:flex-col">
        {/* Video Section */}
        <div className="w-full pt-[2px] pl-[2px] pr-[2px] z-0">
          <SkeletonVideoSection />
        </div>

        {/* First Row of Products */}
        <div className="w-full grid grid-cols-3 p-[2px] gap-[2px] z-10">
          <SkeletonProductCard />
          <SkeletonProductCard />
          <SkeletonProductCard />
        </div>

        {/* Info Section */}
        <SkeletonInfoSection />

        {/* Second Row of Products */}
        <div className="w-full grid grid-cols-3 p-[2px] gap-[2px] z-10">
          <SkeletonProductCard />
          <SkeletonProductCard />
          <SkeletonProductCard />
        </div>
      </div>
    </div>
  );
};

export default SkeletonMainPage;
