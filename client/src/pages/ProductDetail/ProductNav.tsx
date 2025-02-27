import React from 'react';
import { Link } from 'react-router-dom';

const ProductNav: React.FC = () => {
  return (
    <div className="py-6">
      <Link
        to="/shop"
        className="flex items-center space-x-2 text-[#575757] hover:text-gray-900 transition-colors"
      >
        <span className="text-lg">←</span>
        <span className="font-light tracking-[2.85px]">
          Tillbaka till butiken
        </span>
      </Link>
    </div>
  );
};

export default ProductNav;
