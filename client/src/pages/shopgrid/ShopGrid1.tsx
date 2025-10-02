import React, { useEffect, useState } from 'react';
import FilterMenu from '../filter/FilterMenu';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Product } from './types';
import ProductCard from './ProductCard';
import DesktopProductCard from './DesktopProductCard';
import SkeletonProductCard from './SkeletonProductCard';
import SkeletonDesktopProductCard from './SkeletonDesktopProductCard';
import filtericon from '../../assets/filtericon.svg';

const ShopGrid1: React.FC = () => {
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const perPage = 100;

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let allProducts: Product[] = [];
        let currentPage = 1;
        let totalPagesFetched = 1;

        do {
          // 👉 Hämtar redan normaliserade produkter (kurser exkluderade)
          const response = await axios.get(
            `/api/products?page=${currentPage}&per_page=${perPage}`
          );

          const productsFromPage: Product[] = response.data.products || [];
          allProducts = [...allProducts, ...productsFromPage];

          totalPagesFetched = response.data.totalPages || 1;
          currentPage++;
        } while (currentPage <= totalPagesFetched);

        setProducts(allProducts);
        setFilteredProducts(allProducts);

        console.log('Totalt laddade produkter i butik:', allProducts.length);
      } catch (error) {
        console.error('Fel vid hämtning av produkter: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const navigateToProduct = (productId: number) => {
    navigate(`/product/${productId}`);
  };

  const handleFilterProducts = (newFilteredProducts: Product[]) => {
    setFilteredProducts(newFilteredProducts);
  };

  const mobileSkeletonIndices = Array.from({ length: 6 }, (_, index) => index);
  const desktopSkeletonIndices = Array.from({ length: 9 }, (_, index) => index);

  return (
    <div className="p-[1px] max-w-6xl mx-auto">
      <div className="flex ml-[50px]">
        {loading ? (
          <div className="p-3" role="status">
            <div className="w-6 h-6 bg-gray-200 animate-pulse"></div>
            <span className="sr-only">Laddar filter...</span>
          </div>
        ) : (
          <button
            className="pt-[12px] pb-[12px]"
            onClick={() => setIsFilterOpen(true)}
          >
            <img src={filtericon} alt="Öppna filtermenyn" className="w-6 h-6" />
          </button>
        )}
      </div>

      <FilterMenu
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        products={products}
        onFilterProducts={handleFilterProducts}
      />

      <div className="grid grid-cols-2 md:grid-cols-2 auto-rows-auto gap-[1px] lg:hidden">
        {loading
          ? mobileSkeletonIndices.map((index) => (
              <SkeletonProductCard key={index} index={index} />
            ))
          : filteredProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
                onClick={navigateToProduct}
              />
            ))}
      </div>

      <div className="hidden lg:grid lg:grid-cols-3 lg:gap-[1px]">
        {loading
          ? desktopSkeletonIndices.map((index) => (
              <SkeletonDesktopProductCard key={index} />
            ))
          : filteredProducts.map((product) => (
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
