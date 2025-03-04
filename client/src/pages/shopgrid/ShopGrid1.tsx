import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Product } from './types';
import { get } from 'http';

const ShopGrid1: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // Funktion för att beräkna produkt-layoutklasser baserat på index
  const getProductLayoutClass = (index: number): string => {
    let classes = 'cursor-pointer';

    if (index === 2) classes += ' row-start-2';
    if (index === 2) classes += ' row-start-2';
    if (index === 4) classes += ' col-span-2 row-span-2 row-start-3';
    if (index === 5) classes += ' row-start-5';
    if (index === 6) classes += ' row-start-5';

    return classes;
  };

  // Funktion för att beräkna bildhöjdsklasser basert på index
  const getImageHeightClass = (index: number): string => {
    return index === 4 ? 'h-auto md:min-h-[550px]' : 'h-[257px]';
  };

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

  const capitalizeFirstLetter = (name: string) => {
    return name.charAt(0).toUpperCase() + name.slice(1).toLocaleLowerCase();
  };

  if (loading) return <p>Loading...</p>;

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

      {/* Produktgrid */}

      <div className="grid grid-cols-2 md:grid-cols-3 auto-rows-auto gap-[1px]">
        {products.map((product, index) => (
          <div
            key={product.id}
            className={getProductLayoutClass(index)}
            onClick={() => navigateToProduct(product.id)}
          >
            {/* Produktbild */}
            <div
              className={`w-full ${getImageHeightClass(index)} bg-gray-100 overflow-hidden`}
            >
              <img
                src={product.images.at(0)}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Produktnamn och pris */}
            <div className="mt-2 ml-3 flex flex-col justify-between">
              <span className="text-xs font-light leading-none tracking-[2.28px] text-[#1C1B1F]">
                {capitalizeFirstLetter(product.name)}
              </span>
              <div className="flex text-right font-light mr-2 mt-2 mb-2">
                {product.sale_price ? (
                  <>
                    <span className="text-xs line-through text-gray-400">
                      {product.regular_price} SEK
                    </span>
                    <br />
                    <span className="text-xs ml-2">{product.price} SEK</span>
                  </>
                ) : (
                  <span className="text-xs font-light leading-none tracking-[2.28px] text-[#1C1B1F]">
                    {product.price} SEK
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShopGrid1;
