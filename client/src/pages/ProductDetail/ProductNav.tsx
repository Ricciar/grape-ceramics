import React from 'react';
import { Link } from 'react-router-dom';

interface ProductNavProps {
  loading?: boolean;
  isCourse?: boolean;
}

const ProductNav: React.FC<ProductNavProps> = ({ loading = false, isCourse = false }) => {
  if (loading) {
    return (
      <div className="py-6 mt-12" role="status">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-5 bg-gray-200 animate-pulse"></div>
          <div className="w-40 h-5 bg-gray-200 animate-pulse "></div>
        </div>
        <span className="sr-only">Laddar navigation...</span>
      </div>
    );
  }

  return (
    <div className="py-6 mt-12 md:mt-16">
      <Link
        to={isCourse ? "/kurser" : "/butik"}
        className="flex items-center space-x-2 text-[#575757] hover:text-gray-900 transition-colors"
      >
        <span className="text-lg">←</span>
        <span className="font-light tracking-[2.85px]">
          {isCourse ? "Tillbaka till kurser" : "Tillbaka till butiken"}
        </span>
      </Link>
    </div>
  );
};

export default ProductNav;
