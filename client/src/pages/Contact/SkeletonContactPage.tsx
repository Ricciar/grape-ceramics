import React from 'react';

export const SkeletonContactPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center">
      <div className="max-w-[700px] font-sans tracking-custom-wide-2 mt-[20px] mb-[20px] pl-[49px] pr-[49px] animate-pulse w-full">
        <div className="h-[24px] bg-gray-200 w-2/3 mb-[20px]"></div>

        <div className="space-y-4">
          <div className="h-[16px] bg-gray-200 w-full"></div>
          <div className="h-[16px] bg-gray-200 w-5/6"></div>
          <div className="h-[16px] bg-gray-200 w-4/6"></div>

          <div className="py-2"></div>

          <div className="h-[16px] bg-gray-200 w-full"></div>
          <div className="h-[16px] bg-gray-200 w-3/4"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonContactPage;
