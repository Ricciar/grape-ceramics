import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DOMPurify from 'dompurify';
import { Product } from '../shopgrid/types';
import { Link } from 'react-router-dom';

// 🔹 Hjälpfunktion för att formatera namn
const capitalizeFirstLetter = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// 🔹 Hjälpfunktion för pris utan decimaler
const formatPrice = (price: string | null): string => {
  if (!price) return "0";
  const num = Number(price);
  if (isNaN(num)) return price;
  return Math.round(num).toString(); // inga decimaler
};

const CourseProductCard = ({
  product,
  isSoldOut = false,
}: {
  product: Product;
  isSoldOut?: boolean;
}) => {
  const getAltText = (product: Product): string => {
    if (product.images.length > 0) {
      return (product.images[0] as any).alt || product.name;
    }
    return `Bild av ${product.name}`;
  };

  return (
    <div className="flex flex-col w-full">
      <div
        className={`relative w-full h-[390px] md:h-[321px] overflow-hidden ${
          isSoldOut ? 'opacity-70' : ''
        }`}
        style={{
          backgroundImage:
            product.images.length > 0
              ? `url(${(product.images[0] as any).src})`
              : 'none',
          backgroundColor:
            product.images.length > 0 ? 'transparent' : '#f0f0f0',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        aria-label={getAltText(product)}
      >
        {isSoldOut && (
          <div className="absolute bottom-3 left-3 bg-custom-gray text-white px-2 py-1 text-sm font-light z-20 tracking-custom-wide-2">
            Slutsåld
          </div>
        )}
        {product.images.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
            <span className="text-gray-500 text-xs font-light -tracking-custom-wide-xs">
              Ingen bild tillgänglig
            </span>
          </div>
        )}

        <Link
          to={`/kurs/${product.id}`}
          className="block absolute inset-0 group focus:outline-none"
          aria-label={`Visa kurs: ${product.name}`}
        >
          <div
            className={`absolute inset-0 flex items-center justify-center p-4 bg-black bg-opacity-20 
            ${
              !isSoldOut
                ? 'transition-opacity duration-300 group-hover:bg-opacity-0 group-focus:bg-opacity-0'
                : ''
            }`}
          >
            <div className="text-white font-light font-sans tracking-custom-wide-xs text-center">
              <h3 className="text-[22px] md:text-[31px] tracking-widest mb-2">
                {capitalizeFirstLetter(product.name)}
              </h3>
              {(product as any).short_description && (
                <div
                  className="text-sm"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(
                      (product as any).short_description
                    ),
                  }}
                />
              )}
            </div>
          </div>
        </Link>
      </div>

      <div className="mt-2 ml-3 mb-2 flex flex-row justify-between md:mt-4 md:mb-4 mr-3">
        <h3 className="text-xs font-sans font-light tracking-custom-wide-xs">
          {capitalizeFirstLetter(product.name)}
        </h3>
        {product.price && (
          <p
            className={`font-sans font-light text-xs tracking-custom-wide-xs ${
              isSoldOut ? 'line-through text-gray-500' : ''
            }`}
          >
            {formatPrice(product.price)} SEK
          </p>
        )}
      </div>
    </div>
  );
};

const CourseProducts: React.FC = () => {
  const [courseProducts, setCourseProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourseProducts = async () => {
      try {
        setLoading(true);

        const response = await axios.get('/api/courses', {
          params: { per_page: 100 },
        });

        const onlyCourses: Product[] = response.data.products || [];
        setCourseProducts(onlyCourses);
      } catch (err) {
        console.error('Fel vid hämtning av kurser:', err);
        setError('Det gick inte att hämta kurserna.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseProducts();
  }, []);

  if (error) {
    return (
      <div className="text-center p-8">
        <p>{error}</p>
      </div>
    );
  }

  if (loading) {
    return <p className="text-center p-8">Laddar kurser...</p>;
  }

  return (
    <div className="w-full max-w-full px-[2px] overflow-hidden">
      {/* Mobil vy */}
      <div className="grid grid-cols-1 gap-[2px] p-[2px] md:hidden">
        {courseProducts.length > 0 ? (
          courseProducts.map((product) => (
            <CourseProductCard
              key={`product-mobile-${product.id}`}
              product={product}
              isSoldOut={product.stock_status === 'outofstock'}
            />
          ))
        ) : (
          <p className="text-center col-span-1">Inga kurser tillgängliga.</p>
        )}
      </div>

      {/* Desktop vy */}
      <div className="hidden md:grid md:grid-cols-3 md:gap-[2px] p-[2px]">
        {courseProducts.length > 0 ? (
          courseProducts.map((product) => (
            <CourseProductCard
              key={`product-desktop-${product.id}`}
              product={product}
              isSoldOut={product.stock_status === 'outofstock'}
            />
          ))
        ) : (
          <p className="text-center col-span-3">Inga kurser tillgängliga.</p>
        )}
      </div>
    </div>
  );
};

export default CourseProducts;
