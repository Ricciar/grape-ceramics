import React from 'react';

const FooterSkeleton: React.FC = () => {
  return (
    <footer
      aria-label="Loading footer content"
      className="bg-neutral-50 py-10 px-4 text-center"
    >
      <div className="animate-pulse flex flex-col items-center justify-center space-y-2">
        <div className="h-4 bg-gray-200 rounded w-48"></div>
        <div className="h-4 bg-gray-200 rounded w-64"></div>
        <div className="h-4 bg-gray-200 rounded w-56"></div>
      </div>
    </footer>
  );
};

export default FooterSkeleton;
