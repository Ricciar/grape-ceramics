import React, { useState } from 'react';
import ProductNav from './ProductDetail/ProductNav';
import ProductDetail from './ProductDetail/ProductDetail';

const ProductWrapper: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);

  return (
    <div className="w-full min-w-[319px] max-w-md md:max-w-[1200px] mx-auto pl-[1px] pr-[1px]">
      {/* Navigationskomponent */}
      <ProductNav loading={loading} />
      {/* Produktkomponent */}
      <ProductDetail onLoadingChange={setLoading} />
    </div>
  );
};

export default ProductWrapper;
