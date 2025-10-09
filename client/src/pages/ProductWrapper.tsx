import React from "react";
import ProductDetail from "./ProductDetail/ProductDetail";

const ProductWrapper: React.FC = () => {
  return (
    <div className="w-full min-w-[319px] max-w-md md:max-w-[1200px] mx-auto px-[1px]">
      <ProductDetail />
    </div>
  );
};

export default ProductWrapper;
