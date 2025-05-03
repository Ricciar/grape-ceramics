import React from 'react';

const FAQSkeleton: React.FC = () => {
  // Create an array to represent multiple FAQ items
  const skeletonItems = Array.from({ length: 5 }, (_, index) => index);

  return (
    <div
      className="container mx-auto px-4 py-8 max-w-3xl"
      aria-busy="true"
      aria-label="Loading FAQ content"
    >
      {/* Title skeleton */}
      <div className="h-6 bg-gray-200 rounded w-1/3 mx-auto mb-8 animate-pulse"></div>

      {/* FAQ item skeletons */}
      <div className="space-y-4">
        {skeletonItems.map((item) => (
          <div key={item} className="border-t border-[#9B9B9B] overflow-hidden">
            {/* Question skeleton */}
            <div className="px-6 py-4 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="h-5 bg-gray-200 rounded w-4/5"></div>
                <div className="h-5 w-5 bg-gray-200 rounded-sm ml-2"></div>
              </div>
            </div>

            {/* Answer skeleton - first item appears expanded */}
            {item === 0 && (
              <div className="px-6 py-4 bg-white animate-pulse">
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQSkeleton;
