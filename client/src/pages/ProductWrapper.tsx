import React from 'react';
import ProductNav from './ProductDetail/ProductNav';
import ProductDetail from './ProductDetail/ProductDetail';

const ProductWrapper: React.FC = () => {
  return (
    <div className="w-full min-w-[319px] max-w-md md:max-w-[1200px] mx-auto pl-[1px] pr-[1px]">
      <ProductNav /> {/* Navigationskomponent */}
      <ProductDetail /> {/* Produktkomponent */}
    </div>
  );
};

export default ProductWrapper;
