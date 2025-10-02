import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import ProductNav from './ProductDetail/ProductNav';
import ProductDetail from './ProductDetail/ProductDetail';

const ProductWrapper: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const location = useLocation();

  // Bestäm kontext baserat på URL
  const isCourse = location.pathname.startsWith("/kurs/");

  return (
    <div className="w-full min-w-[319px] max-w-md md:max-w-[1200px] mx-auto pl-[1px] pr-[1px]">
      {/* Navigationskomponent */}
      <ProductNav loading={loading} isCourse={isCourse} />
      {/* Produktkomponent */}
      <ProductDetail onLoadingChange={setLoading} />
    </div>
  );
};

export default ProductWrapper;
