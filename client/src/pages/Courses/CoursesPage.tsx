import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DOMPurify from 'dompurify';
import { Product } from '../shopgrid/types';
import SkeletonCourseProduct from './SkeletonCourseProduct';

const CourseProductCard = ({ product }: { product: Product }) => {
  // Hjälpfunktion för att hämta alt-text för produktbilden
  const getAltText = (product: Product): string => {
    if (product.images.length > 0) {
      return product.images[0].alt || product.name;
    }
    return `Bild av ${product.name}`;
  };

  return (
    <div className="flex flex-col w-full">
      {/* Produktbild med beskrivning overlay */}
      <div
        className="relative w-full h-[236px] md:h-[321px] overflow-hidden"
        style={{
          backgroundImage:
            product.images.length > 0
              ? `url(${product.images[0].src})`
              : 'none',
          backgroundColor:
            product.images.length > 0 ? 'transparent' : '#f0f0f0',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        aria-label={getAltText(product)}
      >
        {product.images.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
            <span className="text-gray-500">Ingen bild tillgänglig</span>
          </div>
        )}

        <a
          href={`/product/${product.id}`}
          className="block absolute inset-0 group focus:outline-none"
          aria-label={`Visa produkt: ${product.name}`}
        >
          {/* Beskrivning Overlay - Visas alltid om short_description finns */}
          {product.short_description && (
            <div className="absolute inset-0 flex items-center justify-center p-4 bg-black bg-opacity-20 transition-opacity duration-300 group-hover:bg-opacity-0 group-focus:bg-opacity-0">
              <div className="text-white font-light font-sans text-center tracking-custom-wide-2">
                <h3 className="text-[16px] uppercase tracking-widest mb-2">
                  {product.name}
                </h3>
                <div
                  className="text-sm"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(product.short_description),
                  }}
                />
              </div>
            </div>
          )}
        </a>
      </div>

      {/* Produkt namn och pris */}
      <div className="mt-2 md:mt-4 text-center">
        <h3 className="text-[16px] uppercase tracking-widest mb-1">
          {product.name}
        </h3>
        {product.price && (
          <p className="text-sm tracking-wider">{product.price} SEK</p>
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

        const courseTags = ['courses-one', 'courses-two', 'courses-three'];

        // Hämta ALLA produkter i ett enda anrop, som i MainPage
        const response = await axios.get('/api/products', {
          params: {
            per_page: 100, // Hämta upp till 100 produkter
          },
        });

        // Extrahera produkter från svaret
        const allProducts = response.data.products || [];

        // Skapa en array för att lagra produkter i rätt ordning
        const orderedProductsArray: Product[] = [];

        // För varje tagg, hitta matchande produkt och lägg till i arrayen
        courseTags.forEach((tagSlug) => {
          // Hitta första produkten med denna tagg som inte redan är i arrayen
          const product = allProducts.find(
            (p: Product) =>
              p.tags &&
              p.tags.some((t) => t.slug === tagSlug) &&
              // Se till att produkten inte redan finns i vår array
              !orderedProductsArray.some(
                (existingProduct) => existingProduct.id === p.id
              )
          );

          if (product) {
            orderedProductsArray.push(product);
            console.log(`Found product for ${tagSlug}:`, product.name);
          } else {
            console.log(`No product found for ${tagSlug}`);
          }
        });

        // Om vi inte hittade några specifika kurser, använd fallback
        if (orderedProductsArray.length === 0) {
          console.log('No specific course products found, trying fallback...');

          // Filtrera alla produkter med courses-taggar
          const uniqueProductIds = new Set();
          const coursesProducts = allProducts.filter((p: Product) => {
            if (
              p.tags &&
              p.tags.some((t) => t.slug && t.slug.startsWith('courses-'))
            ) {
              // Kontrollera om vi redan har lagt till detta produkt-ID
              if (!uniqueProductIds.has(p.id)) {
                uniqueProductIds.add(p.id);
                return true;
              }
            }
            return false;
          });

          console.log(
            `Found ${coursesProducts.length} products with courses- tags as fallback`
          );
          setCourseProducts(coursesProducts);
        } else {
          console.log('Final courses array:', orderedProductsArray);
          setCourseProducts(orderedProductsArray);
        }
      } catch (err) {
        console.error('Error fetching course products:', err);
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
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Försök igen
        </button>
      </div>
    );
  }

  // Fix: return statement was missing for loading state
  if (loading) {
    return (
      <div className="w-full max-w-full px-[2px] overflow-hidden">
        {/* Mobile Layout - Laddningsskelett med 2+1 struktur */}
        <div className="md:hidden">
          {/* Första raden - 2 produkter sida vid sida */}
          <div className="grid grid-cols-2 gap-[2px] mb-6">
            <SkeletonCourseProduct key="skeleton-mobile-0" />
            <SkeletonCourseProduct key="skeleton-mobile-1" />
          </div>

          {/* Andra raden - 1 produkt full bredd */}
          <div className="w-full">
            <SkeletonCourseProduct key="skeleton-mobile-2" />
          </div>
        </div>

        {/* Desktop Layout - Three Columns */}
        <div className="hidden md:grid md:grid-cols-3 md:gap-[2px] p-[2px]">
          {Array(3)
            .fill(0)
            .map((_, index) => (
              <SkeletonCourseProduct key={`skeleton-desktop-${index}`} />
            ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full px-[2px] overflow-hidden">
      {/* Mobile Layout - Första raden: 2 produkter sida vid sida, andra raden: 1 produkt full bredd */}
      <div className="md:hidden">
        {courseProducts.length > 0 ? (
          <>
            {/* Första raden - 2 produkter sida vid sida */}
            {courseProducts.length >= 2 && (
              <div className="grid grid-cols-2 gap-[2px] mb-6">
                <CourseProductCard
                  key={`product-mobile-${courseProducts[0].id}`}
                  product={courseProducts[0]}
                />
                <CourseProductCard
                  key={`product-mobile-${courseProducts[1].id}`}
                  product={courseProducts[1]}
                />
              </div>
            )}

            {/* Andra raden - 1 produkt full bredd */}
            {courseProducts.length >= 3 && (
              <div className="w-full">
                <CourseProductCard
                  key={`product-mobile-${courseProducts[2].id}`}
                  product={courseProducts[2]}
                />
              </div>
            )}
          </>
        ) : (
          <p className="text-center">Inga kurser tillgängliga.</p>
        )}
      </div>

      {/* Desktop Layout - Three Columns */}
      <div className="hidden md:grid md:grid-cols-3 md:gap-[2px] p-[2px]">
        {courseProducts.length > 0 ? (
          // Course products for desktop
          courseProducts.map((product) => (
            <CourseProductCard
              key={`product-desktop-${product.id}`}
              product={product}
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
