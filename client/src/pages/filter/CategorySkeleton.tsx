import React from 'react';

const CategorySkeleton: React.FC<{ count?: number }> = ({ count = 5 }) => {
  return (
    <div
      className="space-y-4 animate-pulse"
      aria-busy="true"
      aria-label="Laddar kategorier"
    >
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="h-6 bg-gray-200 w-3/4"></div>
      ))}
    </div>
  );
};

export default CategorySkeleton;
