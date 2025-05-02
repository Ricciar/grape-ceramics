import React, { useEffect, useState } from 'react';
import FilterMenu from '../filter/FilterMenu';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Product } from './types';
import ProductCard from './ProductCard';
import DesktopProductCard from './DesktopProductCard';
import SkeletonProductCard from './SkeletonProductCard';
import SkeletonDesktopProductCard from './SkeletonDesktopProductCard';

const ShopGrid1: React.FC = () => {
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage] = useState(7);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        console.log('Fetching products for page:', page, 'per page:', perPage);
        const response = await axios.get(
          `/api/products?page=${page}&per_page=${perPage}`
        );

        setProducts(response.data.products || []);
        setFilteredProducts(response.data.products || []);
        setTotalPages(response.data.totalPages || 1);

        console.log('Products loaded:', filteredProducts.length);
        console.log('Total pages:', totalPages);
      } catch (error) {
        console.error('Error fetching products: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page, perPage]);

  const navigateToProduct = (productId: number) => {
    navigate(`/product/${productId}`);
  };

  const handleFilterProducts = (newFilteredProducts: Product[]) => {
    setFilteredProducts(newFilteredProducts);
    setPage(1);
  };

  // Funktion som skapar en array för skeleton placeholders
  const mobileSkeletonIndices = Array.from(
    { length: perPage },
    (_, index) => index
  );
  const desktopSkeletonIndices = Array.from(
    { length: perPage },
    (_, index) => index
  );

  const renderPagination = () => {
    // Visa inte pagination om det bara finns en sida
    if (totalPages <= 1) return null;

    return (
      <div className="flex justify-center items-center my-8">
        <div className="flex items-center space-x-2 font-sans font-light">
          {/* Vänster pil */}
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="text-gray-400 disabled:text-gray-200"
            aria-label="Föregående sida"
          >
            <span className="text-xl">&lt;</span>
          </button>

          {/* Sidnummer */}
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((pageNum) => {
              return (
                pageNum === 1 ||
                pageNum === totalPages ||
                Math.abs(pageNum - page) <= 1
              );
            })
            .map((pageNum, index, filteredPages) => (
              <React.Fragment key={pageNum}>
                {index > 0 && filteredPages[index - 1] !== pageNum - 1 && (
                  <span className="text-gray-400">...</span>
                )}
                <button
                  onClick={() => setPage(pageNum)}
                  className={`w-10 h-10 flex items-center justify-center ${
                    pageNum === page
                      ? 'text-black'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                  aria-label={`Gå till sida ${pageNum}`}
                  aria-current={pageNum === page ? 'page' : undefined}
                >
                  {pageNum}
                </button>
              </React.Fragment>
            ))}

          {/* Höger pil */}
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className="text-gray-400 disabled:text-gray-200"
            aria-label="Nästa sida"
          >
            <span className="text-xl">&gt;</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="p-[1px] max-w-6xl mx-auto">
      {/* Filterikon */}
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
            <img
              src="../src/assets/filtericon.svg"
              alt="Öppna filtermenyn"
              className="w-6 h-6"
            />
          </button>
        )}
      </div>

      {/* FilterMenu komponenten */}
      <FilterMenu
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        products={products}
        onFilterProducts={handleFilterProducts}
      />

      {/* Mobil & tablet layout */}
      <div className="grid grid-cols-2 md:grid-cols-2 auto-rows-auto gap-[1px] lg:hidden">
        {loading
          ? // Visa skeleton loaders
            mobileSkeletonIndices.map((index) => (
              <SkeletonProductCard key={index} index={index} />
            ))
          : // Visa produkter
            filteredProducts.map((product, index) => (
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
            filteredProducts.map((product) => (
              <DesktopProductCard
                key={product.id}
                product={product}
                onClick={navigateToProduct}
              />
            ))}
      </div>
      {/* Paginering */}
      {!loading && renderPagination()}
    </div>
  );
};

export default ShopGrid1;
