import React from 'react';

const SkeletonCourseProduct = () => {
  return (
    <div className="flex flex-col w-full">
      <div className="relative w-full h-[236px] md:h-[321px] bg-gray-200 animate-pulse"></div>
      <div className="mt-2 md:mt-4 text-center">
        <div className="h-5 bg-gray-200 w-3/4 mx-auto mb-1 animate-pulse"></div>
        <div className="h-4 bg-gray-200 w-1/2 mx-auto animate-pulse"></div>
      </div>
    </div>
  );
};

export default SkeletonCourseProduct;
