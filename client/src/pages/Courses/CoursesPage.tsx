import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DOMPurify from 'dompurify';
import { Product } from '../shopgrid/types';
import SkeletonCourseProduct from './SkeletonCourseProduct';

const CourseProductCard = ({
  product,
  isSoldOut = false,
}: {
  product: Product;
  isSoldOut?: boolean;
}) => {
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
        className={`relative w-full h-[236px] md:h-[321px] overflow-hidden ${isSoldOut ? 'opacity-70' : ''}`}
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
        {/* Visa "SLUTSÅLD"-etikett om produkten är slutsåld */}
        {isSoldOut && (
          <div className="absolute top-0 left-0 bg-gray-900 text-white px-2 py-1 text-sm font-medium z-20">
            SLUTSÅLD
          </div>
        )}
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
        <h3 className="text-[16px] uppercase tracking-custom-wide-2">
          {product.name}
        </h3>
        {product.price && (
          <p
            className={`text-sm tracking-wider ${isSoldOut ? 'line-through text-gray-500' : ''}`}
          >
            {product.price} SEK
            {isSoldOut && (
              <span className="ml-2 text-gray-700 no-underline">Slutsåld</span>
            )}
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

        const courseTags = ['courses-one', 'courses-two', 'courses-three'];

        // Steg 1: Hämta alla produkter med grundläggande information
        const listResponse = await axios.get('/api/products', {
          params: {
            per_page: 100,
            _fields: 'id,name,images,tags',
          },
        });

        const allProducts = listResponse.data.products || [];
        console.log('Alla produkter hämtade:', allProducts.length);

        // Steg 2: Filtrera ut produkter med kurstaggar
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
            console.log(`Hittade produkt för ${tagSlug}:`, product.name);
          } else {
            console.log(`Ingen produkt hittades för ${tagSlug}`);
          }
        });

        // Filtrera även andra kursprodukter som fallback
        let coursesProducts: Product[] = [];
        if (orderedProductsArray.length === 0) {
          console.log('Inga specifika kurser hittades, använder fallback...');

          // Filtrera alla produkter med courses-taggar
          const uniqueProductIds = new Set();
          coursesProducts = allProducts.filter((p: Product) => {
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
            `Hittade ${coursesProducts.length} produkter med courses-taggar som fallback`
          );
        }

        // Steg 3: Hämta detaljerad information för varje kursprodukt
        const productsToFetch =
          orderedProductsArray.length > 0
            ? orderedProductsArray
            : coursesProducts;

        console.log(
          `Hämtar detaljerad information för ${productsToFetch.length} produkter...`
        );

        if (productsToFetch.length === 0) {
          // Inga kursprodukter hittades
          setCourseProducts([]);
          setLoading(false);
          return;
        }

        // Hämta detaljerad info med Promise.all
        const detailedProducts = await Promise.all(
          productsToFetch.map((p) =>
            axios
              .get(`/api/products/${p.id}`)
              .then((res) => res.data)
              .catch((error) => {
                console.error(`Fel vid hämtning av produkt ${p.id}:`, error);
                // Returnera den grundläggande produkten om detaljerad hämtning misslyckas
                return p;
              })
          )
        );

        console.log(
          'Detaljerad kursinformation hämtad:',
          detailedProducts.length
        );

        // Sätt kursproduktdata
        setCourseProducts(detailedProducts);
      } catch (err) {
        console.error('Fel vid hämtning av kursprodukter:', err);
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
                  isSoldOut={courseProducts[0].stock_status === 'outofstock'}
                />
                <CourseProductCard
                  key={`product-mobile-${courseProducts[1].id}`}
                  product={courseProducts[1]}
                  isSoldOut={courseProducts[1].stock_status === 'outofstock'}
                />
              </div>
            )}

            {/* Andra raden - 1 produkt full bredd */}
            {courseProducts.length >= 3 && (
              <div className="w-full">
                <CourseProductCard
                  key={`product-mobile-${courseProducts[2].id}`}
                  product={courseProducts[2]}
                  isSoldOut={courseProducts[2].stock_status === 'outofstock'}
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
