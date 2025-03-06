import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Product } from './types';
import ProductCard from './ProductCard';
import DesktopProductCard from './DesktopProductCard';
import SkeletonProductCard from './SkeletonProductCard';
import SkeletonDesktopProductCard from './SkeletonDesktopProductCard';

const ShopGrid1: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('/api/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const navigateToProduct = (productId: number) => {
    navigate(`/product/${productId}`);
  };

  // Funktion som skapar en array för skeleton placeholders
  const mobileSkeletonIndices = Array.from({ length: 7 }, (_, index) => index);
  const desktopSkeletonIndices = Array.from({ length: 9 }, (_, index) => index);

  return (
    <div className="p-[1px] max-w-6xl mx-auto">
      {/* Filterikon */}
      <div className="flex ml-[50px]">
        <button className="p-3">
          <img
            src="../src/assets/filtericon.svg"
            alt="Filter"
            className="w-6 h-6"
          />
        </button>
      </div>

      {/* Mobil & tablet layout */}
      <div className="grid grid-cols-2 md:grid-cols-2 auto-rows-auto gap-[1px] lg:hidden">
        {loading
          ? // Visa skeleton loaders
            mobileSkeletonIndices.map((index) => (
              <SkeletonProductCard key={index} index={index} />
            ))
          : // Visa produkter
            products.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
                onClick={navigateToProduct}
              />
            ))}
      </div>

      {/* Desktop layout */}
      <div className="hidden lg:grid lg:grid-cols-3 lg:gap-[1px]">
        {loading
          ? // Visa desktop skeleton loaders
            desktopSkeletonIndices.map((index) => (
              <SkeletonDesktopProductCard key={index} />
            ))
          : // Visa desktop produkter
            products.map((product) => (
              <DesktopProductCard
                key={product.id}
                product={product}
                onClick={navigateToProduct}
              />
            ))}
      </div>
    </div>
  );
};

export default ShopGrid1;
