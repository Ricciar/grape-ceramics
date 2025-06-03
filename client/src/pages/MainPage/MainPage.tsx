import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DOMPurify from 'dompurify';
import { WPPage } from './types';
import { Product, FeaturedProducts } from '../shopgrid/types';
import { extractVideoBlock } from '../../utils/extractVideoBlock';
import { SkeletonMainPage } from './SkeletonMainPage';

// Mobile/Tablet Product Card Component
const MobileProductCard = ({
  product,
  showDescription = false,
}: {
  product: Product;
  showDescription?: boolean;
}) => {
  // Helper function to get alt text from a product
  const getAltText = (product: Product): string => {
    if (product.images.length > 0) {
      return product.images[0].alt || product.name;
    }
    return `Bild av ${product.name}`;
  };

  return (
    <div
      className="relative w-full h-[236px] md:h-[321px] overflow-hidden"
      style={{
        backgroundImage:
          product.images.length > 0 ? `url(${product.images[0].src})` : 'none',
        backgroundColor: product.images.length > 0 ? 'transparent' : '#f0f0f0',
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
        <div className="absolute inset-0 flex items-center justify-center p-4 bg-black bg-opacity-20 transition-opacity duration-300 group-hover:bg-opacity-0 group-focus:bg-opacity-0">
          {showDescription && product.short_description ? (
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
          ) : null}
        </div>
      </a>
    </div>
  );
};

// Desktop Product Card Component
const DesktopProductCard = ({
  product,
  showDescription = false,
}: {
  product: Product;
  showDescription?: boolean;
}) => {
  return (
    <MobileProductCard product={product} showDescription={showDescription} />
  );
};

const MainPage: React.FC = () => {
  // State for content
  const [homePage, setHomePage] = useState<WPPage | null>(null);

  const [featuredProducts, setFeaturedProducts] = useState<FeaturedProducts>({
    one: null,
    two: null,
    three: null,
    four: null,
    five: null,
    six: null,
  });

  // State for info section
  const [infoSection, setInfoSection] = useState<WPPage | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const featuredTags = [
          'featured-one',
          'featured-two',
          'featured-three',
          'featured-four',
          'featured-five',
          'featured-six',
        ];

        // Fetch home page for video block
        const homePageRequest = axios.get(`/api/pages?slug=startsida`);

        // Fetch info page or use home page as fallback
        const infoPageRequest = axios.get(`/api/pages?slug=info`);

        // Fetch ALL products in a single request
        const allProductsRequest = axios.get(`/api/products`, {
          params: {
            per_page: 100, // Fetch up to 100 products
          },
        });

        // Wait for all requests in parallel
        const [homeResponse, infoPageResponse, allProductsResponse] =
          await Promise.all([
            homePageRequest,
            infoPageRequest,
            allProductsRequest,
          ]);

        // Extract products from response
        const allProducts = allProductsResponse.data.products || [];

        // Create object with featured products based on tags
        const featuredProductsObj: FeaturedProducts = {
          one: null,
          two: null,
          three: null,
          four: null,
          five: null,
          six: null,
        };

        type PositionKey = keyof FeaturedProducts;

        // For each tag, find matching product
        featuredTags.forEach((tagSlug, index) => {
          const positions: PositionKey[] = [
            'one',
            'two',
            'three',
            'four',
            'five',
            'six',
          ];
          const position = positions[index];

          // Find first product with this tag
          const product = allProducts.find(
            (p: Product) => p.tags && p.tags.some((t) => t.slug === tagSlug)
          );

          if (product) {
            featuredProductsObj[position] = product;
          }
        });

        // Set states
        if (homeResponse.data.length > 0) {
          setHomePage(homeResponse.data[0]);
        }

        setFeaturedProducts(featuredProductsObj);

        if (infoPageResponse.data.length > 0) {
          setInfoSection(infoPageResponse.data[0]);
        } else if (homeResponse.data.length > 0) {
          // Fallback if no info page exists
          setInfoSection(homeResponse.data[0]);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Det gick inte att hämta innehållet.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <SkeletonMainPage />;
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Försök igen
        </button>
      </div>
    );
  }

  // Extract video content from the home page
  const videoContent = homePage?.content?.rendered
    ? extractVideoBlock(homePage.content.rendered)
    : null;

  // Convert featured products to array for easier mapping
  const featuredProductsArray = [
    featuredProducts.one,
    featuredProducts.two,
    featuredProducts.three,
    featuredProducts.four,
    featuredProducts.five,
    featuredProducts.six,
  ].filter((product) => product !== null);

  return (
    <div className="w-full max-w-full ml-[2px] mr-[2px] overflow-hidden">
      {/* Mobile/Tablet Layout */}
      <div className="flex flex-col md:hidden">
        {/* Video Section */}
        <div className="w-full bg-gray-100 h-full mt-[2px] mb-[2px] z-0">
          {videoContent ? (
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(videoContent),
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200 mt-[2px] z-0">
              <p>Ingen video tillgänglig</p>
            </div>
          )}
        </div>

        {/* First Row of Products */}
        {featuredProductsArray.length >= 2 && (
          <div className="w-full grid grid-cols-2 gap-[1px] z-10">
            {featuredProductsArray[0] && (
              <MobileProductCard
                product={featuredProductsArray[0]}
                showDescription={true}
              />
            )}
            {featuredProductsArray[1] && (
              <MobileProductCard
                product={featuredProductsArray[1]}
                showDescription={false}
              />
            )}
          </div>
        )}

        {/* Info Section */}
        {infoSection && (
          <div className="w-full bg-[#DFCABB] py-8 px-4 text-center h-[225px] md:h-[456px] flex items-center justify-center ml-[2px] mr-[2px] z-10">
            <div className="max-w-4xl mx-auto">
              <h2
                className="text-2xl uppercase tracking-custom-wide-2 text-gray-800 mb-6"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(infoSection.title.rendered),
                }}
              />
              <div
                className="text-gray-700 text-sm tracking-custom-wide-2 leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(infoSection.content.rendered),
                }}
              />
            </div>
          </div>
        )}

        {/* Second Row of Products (only mobile) */}
        {featuredProductsArray.length >= 4 && (
          <div className="w-full grid grid-cols-2 gap-[2px] mb-[2px] z-10 md:hidden">
            {featuredProductsArray[2] && (
              <MobileProductCard
                product={featuredProductsArray[2]}
                showDescription={true}
              />
            )}
            {featuredProductsArray[3] && (
              <MobileProductCard
                product={featuredProductsArray[3]}
                showDescription={true}
              />
            )}
          </div>
        )}

        {/* Third Row of Products (only mobile) */}
        {featuredProductsArray.length >= 6 && (
          <div className="w-full grid grid-cols-2 pl-[2px] pr-[2px] pb-[2px] gap-[2px] z-10 md:hidden">
            {featuredProductsArray[4] && (
              <MobileProductCard
                product={featuredProductsArray[4]}
                showDescription={false}
              />
            )}
            {featuredProductsArray[5] && (
              <MobileProductCard
                product={featuredProductsArray[5]}
                showDescription={false}
              />
            )}
          </div>
        )}
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex md:flex-col">
        {/* Video Section */}
        <div className="w-full pt-[2px] pl-[2px] pr-[2px] z-0">
          {videoContent ? (
            <div
              className="w-full max-h-[400px] overflow-hidden"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(videoContent),
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-gray-900">Ingen video tillgänglig</p>
            </div>
          )}
        </div>

        {/* First Row of Products */}
        {featuredProductsArray.length >= 3 && (
          <div className="w-full grid grid-cols-3 p-[2px] gap-[2px] z-10">
            {featuredProductsArray[0] && (
              <DesktopProductCard
                product={featuredProductsArray[0]}
                showDescription={true}
              />
            )}
            {featuredProductsArray[1] && (
              <DesktopProductCard
                product={featuredProductsArray[1]}
                showDescription={false}
              />
            )}
            {/* Third product shown in desktop layout row 1 but not in mobile layout row 1 */}
            {featuredProductsArray[2] && (
              <div className="hidden md:block">
                <DesktopProductCard
                  product={featuredProductsArray[2]}
                  showDescription={false}
                />
              </div>
            )}
          </div>
        )}

        {/* Info Section */}
        {infoSection && (
          <div className="w-full bg-[#DFCABB] py-8 px-4 tracking-custom-wide-2 text-center text-sans h-[456px] flex items-center justify-center z-10">
            <div className="max-w-4xl mx-auto">
              <h2
                className="text-[18px] uppercase tracking-custom-wider-2 text-gray-800 mb-6"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(infoSection.title.rendered),
                }}
              />
              <div
                className="text-gray-800 text-[16px] tracking-custom-wide-2 md:text-base leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(infoSection.content.rendered),
                }}
              />
            </div>
          </div>
        )}

        {/* Second Row of Products - Desktop only with products 3-6 in one row */}
        {featuredProductsArray.length >= 6 && (
          <div className="hidden md:grid md:grid-cols-3 md:gap-[2px] p-[2px] z-10">
            {featuredProductsArray[3] && (
              <DesktopProductCard
                product={featuredProductsArray[3]}
                showDescription={true}
              />
            )}
            {featuredProductsArray[4] && (
              <DesktopProductCard
                product={featuredProductsArray[4]}
                showDescription={false}
              />
            )}
            {featuredProductsArray[5] && (
              <DesktopProductCard
                product={featuredProductsArray[5]}
                showDescription={false}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MainPage;
